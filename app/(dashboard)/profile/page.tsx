"use client";

import { useAppSelector } from "@/store/hooks";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { auth } from "@/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { User, Mail, Calendar, Shield, LogOut, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function ProfilePage() {
    const { user } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { t } = useTranslation();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            dispatch(logout());
            router.replace("/");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const userEmail = user?.email || "guest@taskpro.com";
    const initials = userEmail.substring(0, 2).toUpperCase();
    const createdAt = user?.metadata?.creationTime
        ? new Date(user.metadata.creationTime).toLocaleDateString()
        : "Recently";

    return (
        <div className="flex h-full flex-col gap-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground">{t("profile.title") || "Profile"}</h1>
                <p className="text-muted-foreground">{t("profile.subtitle") || "Manage your account settings"}</p>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-y-auto">
                <Card className="lg:col-span-2 flex flex-col">
                    <CardHeader>
                        <CardTitle>{t("profile.user_info") || "User Information"}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 flex-1">
                        <div className="flex items-center gap-4">
                            <Avatar size="lg" fallback={initials} />
                            <div>
                                <p className="font-medium text-foreground">{userEmail}</p>
                                <p className="text-sm text-muted-foreground">
                                    {user?.isAnonymous ? t("profile.guest_account") || "Guest Account" : t("profile.registered_account") || "Registered Account"}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                                <Mail className="h-5 w-5 text-primary" />
                                <div>
                                    <p className="text-xs text-muted-foreground">{t("profile.email") || "Email"}</p>
                                    <p className="font-medium text-sm text-foreground">{userEmail}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                                <Calendar className="h-5 w-5 text-primary" />
                                <div>
                                    <p className="text-xs text-muted-foreground">{t("profile.created") || "Created"}</p>
                                    <p className="font-medium text-sm text-foreground">{createdAt}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                                <Shield className="h-5 w-5 text-primary" />
                                <div>
                                    <p className="text-xs text-muted-foreground">{t("profile.account_type") || "Account Type"}</p>
                                    <p className="font-medium text-sm text-foreground">
                                        {user?.isAnonymous ? "Guest" : "Standard"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                                <User className="h-5 w-5 text-primary" />
                                <div>
                                    <p className="text-xs text-muted-foreground">{t("profile.status") || "Status"}</p>
                                    <p className="font-medium text-sm text-green-600 dark:text-green-400">Active</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex flex-col gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t("profile.preferences") || "Preferences"}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-foreground">{t("profile.theme") || "Theme"}</p>
                                    <p className="text-sm text-muted-foreground">{t("profile.theme_desc") || "Choose your theme"}</p>
                                </div>
                                <ThemeToggle />
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t border-border">
                                <div>
                                    <p className="font-medium text-foreground">{t("profile.language") || "Language"}</p>
                                    <p className="text-sm text-muted-foreground">{t("profile.language_desc") || "Select language"}</p>
                                </div>
                                <LanguageSwitcher />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="mt-auto">
                        <CardHeader>
                            <CardTitle className="text-destructive">{t("profile.danger_zone") || "Danger Zone"}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">
                                {t("profile.logout_desc") || "Sign out of your account"}
                            </p>
                        </CardContent>
                        <CardFooter>
                            <Button
                                variant="destructive"
                                className="w-full"
                                onClick={handleLogout}
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                {t("nav.logout") || "Logout"}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}
