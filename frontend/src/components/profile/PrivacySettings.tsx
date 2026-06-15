import { Bell, Shield, ShieldBan, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useAuthStore } from "@/stores/useAuthStore";
import { useUserStore } from "@/stores/useUserStore";

const PrivacySettings = () => {
  const { user } = useAuthStore();
  const { blockAndReportUser, changePassword, deleteAccount, updateProfile } =
    useUserStore();
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [blockOpen, setBlockOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [blockUsername, setBlockUsername] = useState("");
  const [reportReason, setReportReason] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (event: React.FormEvent) => {
    event.preventDefault();

    if (newPassword !== confirmPassword) {
      return;
    }

    setLoading(true);
    try {
      await changePassword(currentPassword, newPassword);
      setPasswordOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const handleBlockReport = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      await blockAndReportUser(blockUsername, reportReason);
      setBlockUsername("");
      setReportReason("");
      setBlockOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      await deleteAccount();
      setDeleteOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card className="glass-strong">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Quyền riêng tư & Bảo mật
          </CardTitle>
          <CardDescription>
            Quản lý cài đặt quyền riêng tư và bảo mật của bạn
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Button
              variant="outline"
              className="w-full justify-start bg-background hover:border-warning/30 hover:text-warning"
              onClick={() => setPasswordOpen(true)}
            >
              <Shield className="h-4 w-4 mr-2" />
              Đổi mật khẩu
            </Button>

            <div className="flex items-center justify-between gap-4 rounded-lg border border-border/70 bg-background p-4">
              <div className="flex items-start gap-3">
                <Bell className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div>
                  <Label htmlFor="notification-toggle" className="text-base font-semibold">
                    Cài đặt thông báo
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Bật hoặc tắt thông báo trong ứng dụng
                  </p>
                </div>
              </div>
              <Switch
                id="notification-toggle"
                checked={user?.notificationEnabled ?? true}
                onCheckedChange={(checked) =>
                  updateProfile({ notificationEnabled: checked })
                }
                className="data-[state=checked]:bg-primary"
              />
            </div>

            <Button
              variant="outline"
              className="w-full justify-start bg-background hover:border-destructive/30 hover:text-destructive"
              onClick={() => setBlockOpen(true)}
            >
              <ShieldBan className="size-4 mr-2" />
              Chặn & Báo cáo
            </Button>
          </div>

          <div className="border-t border-border/70 pt-4">
            <h4 className="mb-3 font-semibold text-destructive">Khu vực nguy hiểm</h4>
            <Button
              variant="destructive"
              className="w-full"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 className="size-4" />
              Xoá tài khoản
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={passwordOpen} onOpenChange={setPasswordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Đổi mật khẩu</DialogTitle>
            <DialogDescription>
              Sau khi đổi mật khẩu, bạn cần đăng nhập lại.
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleChangePassword}>
            <div className="space-y-2">
              <Label htmlFor="current-password">Mật khẩu hiện tại</Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">Mật khẩu mới</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Nhập lại mật khẩu mới</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
              {newPassword !== confirmPassword && confirmPassword && (
                <p className="text-sm text-destructive">Mật khẩu nhập lại không khớp</p>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setPasswordOpen(false)}>
                Huỷ
              </Button>
              <Button
                type="submit"
                disabled={
                  loading ||
                  !currentPassword ||
                  !newPassword ||
                  newPassword !== confirmPassword
                }
              >
                Đổi mật khẩu
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={blockOpen} onOpenChange={setBlockOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chặn & Báo cáo</DialogTitle>
            <DialogDescription>
              Người dùng bị chặn sẽ được lưu vào tài khoản của bạn.
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleBlockReport}>
            <div className="space-y-2">
              <Label htmlFor="block-username">Username</Label>
              <Input
                id="block-username"
                value={blockUsername}
                onChange={(event) => setBlockUsername(event.target.value)}
                placeholder="username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="report-reason">Lý do báo cáo</Label>
              <Textarea
                id="report-reason"
                value={reportReason}
                onChange={(event) => setReportReason(event.target.value)}
                rows={3}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setBlockOpen(false)}>
                Huỷ
              </Button>
              <Button type="submit" disabled={loading || !blockUsername}>
                Lưu
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xoá tài khoản</DialogTitle>
            <DialogDescription>
              Hành động này sẽ xoá tài khoản và đăng xuất bạn khỏi ứng dụng.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Label htmlFor="delete-confirm">Nhập DELETE để xác nhận</Label>
            <Input
              id="delete-confirm"
              value={deleteConfirm}
              onChange={(event) => setDeleteConfirm(event.target.value)}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDeleteOpen(false)}>
              Huỷ
            </Button>
            <Button
              variant="destructive"
              disabled={loading || deleteConfirm !== "DELETE"}
              onClick={handleDeleteAccount}
            >
              Xoá tài khoản
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PrivacySettings;
