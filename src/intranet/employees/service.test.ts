import { describe, expect, it, vi } from "vite-plus/test";

import { createEmployeeService } from "#/intranet/components/forge/plugins/employees/server/employees.server";

const employee = {
  id: "employee",
  name: "Employee",
  email: "employee@example.test",
  role: "user",
  emailVerified: false,
  mustChangePassword: true,
};

function setup(delivered = true) {
  const api = {
    listUsers: vi.fn(async () => ({ users: [employee], total: 1 })),
    createUser: vi.fn(async () => ({ user: employee })),
    getUser: vi.fn(async () => employee),
    adminUpdateUser: vi.fn(async () => employee),
    banUser: vi.fn(async () => ({ user: employee })),
    unbanUser: vi.fn(async () => ({ user: employee })),
    removeUser: vi.fn(async () => ({})),
    sendVerificationEmail: vi.fn(async () => ({})),
  };
  const sendInvitation = vi.fn(async () => {
    if (!delivered) throw new Error("Delivery failed");
  });
  const options = {
    api,
    sendInvitation,
    headers: new Headers(),
    actor: { id: "admin", role: "admin" },
    verificationEnabled: true,
  };
  return { api, sendInvitation, options, service: createEmployeeService(options) };
}

describe("employee invitation integration", () => {
  it("requires fresh administrator authorization", () => {
    const { options } = setup();
    expect(() =>
      createEmployeeService({ ...options, actor: { id: "other", role: "user" } }),
    ).toThrow("Administrator access");
  });

  it("creates an invited account without an administrator-assigned password", async () => {
    const { service, api, sendInvitation } = setup();
    await expect(
      service.create(
        { name: employee.name, email: employee.email },
        "https://example.test/en/reset-password",
      ),
    ).resolves.toEqual({ user: employee, invitationSent: true });
    expect(api.createUser).toHaveBeenCalledWith(
      expect.objectContaining({
        body: {
          name: employee.name,
          email: employee.email,
          role: "user",
          data: { mustChangePassword: true },
        },
      }),
    );
    expect(sendInvitation).toHaveBeenCalledWith(employee, "https://example.test/en/reset-password");
  });

  it("keeps a created account available for resend after delivery failure", async () => {
    const { service, api } = setup(false);
    await expect(
      service.create(
        { name: employee.name, email: employee.email },
        "https://example.test/en/reset-password",
      ),
    ).resolves.toEqual({ user: employee, invitationSent: false });
    expect(api.removeUser).not.toHaveBeenCalled();
  });

  it("rejects creation before persistence when email is not configured", async () => {
    const { options, api } = setup();
    await expect(
      createEmployeeService({ ...options, verificationEnabled: false }).create(
        employee,
        "https://example.test/reset-password",
      ),
    ).rejects.toThrow("Email delivery");
    expect(api.createUser).not.toHaveBeenCalled();
  });

  it("prevents deleting the active administrator", async () => {
    const { service, api } = setup();
    await expect(service.remove({ id: "admin" })).rejects.toThrow("own account");
    expect(api.removeUser).not.toHaveBeenCalled();
  });
});
