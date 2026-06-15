import api from "@/lib/axios";
import type { User } from "@/types/user";

type UpdateProfilePayload = Partial<
  Pick<
    User,
    | "displayName"
    | "username"
    | "email"
    | "phone"
    | "bio"
    | "showOnlineStatus"
    | "notificationEnabled"
  >
>;

export const userService = {
  uploadAvatar: async (formData: FormData) => {
    const res = await api.post("/users/uploadAvatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (res.status === 400) {
      throw new Error(res.data.message);
    }

    return res.data;
  },

  updateProfile: async (payload: UpdateProfilePayload): Promise<User> => {
    const res = await api.patch("/users/me", payload);
    return res.data.user;
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    const res = await api.patch("/users/password", {
      currentPassword,
      newPassword,
    });
    return res.data;
  },

  blockAndReportUser: async (username: string, reason?: string): Promise<User> => {
    const res = await api.post("/users/block-report", { username, reason });
    return res.data.user;
  },

  deleteAccount: async () => {
    const res = await api.delete("/users/me");
    return res.data;
  },
};
