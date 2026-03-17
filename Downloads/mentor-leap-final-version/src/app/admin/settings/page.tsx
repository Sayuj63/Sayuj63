"use client";
import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Toast } from "@/components/ui/Toast";
import { Settings, Shield, Bell, Globe, Database, Save } from "lucide-react";

export default function AdminSettings() {
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, message: "", type: "success" as "success" | "error" });

    const handleSave = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setToast({ show: true, message: "System configuration synchronized", type: "success" });
        }, 1000);
    };

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <div className="mb-12">
                <h1 className="text-3xl font-black mb-2 tracking-tight">System Configuration</h1>
                <p className="text-[#475569] font-bold text-xs uppercase tracking-[0.2em]">Global platform parameters</p>
            </div>

            <div className="space-y-8">
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <Globe className="text-[#00e5ff]" size={20} />
                        <h2 className="font-bold tracking-tight">Public Website Metadata</h2>
                    </div>
                    <Card className="!p-8 bg-white/[0.02] border-white/5 space-y-6">
                        <Input label="Platform Name" defaultValue="MentorLeap" />
                        <Textarea label="Global SEO Description" defaultValue="The ultimate mentorship and growth platform for future leaders." />
                        <div className="grid grid-cols-2 gap-4">
                            <Input label="Support Email" defaultValue="support@mentorleap.com" />
                            <Input label="WhatsApp API Contact" defaultValue="+91 9999999999" />
                        </div>
                    </Card>
                </section>

                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <Shield className="text-[#00e5ff]" size={20} />
                        <h2 className="font-bold tracking-tight">Access & Security</h2>
                    </div>
                    <Card className="!p-8 bg-white/[0.02] border-white/5 space-y-6">
                        <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/5">
                            <div>
                                <p className="text-sm font-bold mb-0.5">Two-Factor Authentication</p>
                                <p className="text-[10px] text-[#475569] font-bold uppercase tracking-widest">Required for all Admin accounts</p>
                            </div>
                            <div className="w-12 h-6 bg-[#00e5ff] rounded-full relative">
                                <div className="absolute right-1 top-1 w-4 h-4 bg-black rounded-full shadow-lg"></div>
                            </div>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/5">
                            <div>
                                <p className="text-sm font-bold mb-0.5">Session Timeout</p>
                                <p className="text-[10px] text-[#475569] font-bold uppercase tracking-widest">Auto-logout after 2 hours of inactivity</p>
                            </div>
                            <Input className="w-24 h-10 text-center" defaultValue="120" />
                        </div>
                    </Card>
                </section>

                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <Bell className="text-[#00e5ff]" size={20} />
                        <h2 className="font-bold tracking-tight">Notification Channels</h2>
                    </div>
                    <Card className="!p-8 bg-white/[0.02] border-white/5 space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            {['Admin Web Push', 'Student Email Alerts', 'Discord Webhooks', 'Slack Integration'].map(notif => (
                                <div key={notif} className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-[#cbd5f5]">{notif}</span>
                                    <div className="w-10 h-5 bg-white/10 rounded-full relative">
                                        <div className="absolute left-1 top-1 w-3 h-3 bg-[#475569] rounded-full"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </section>

                <div className="flex justify-end pt-10">
                    <Button onClick={handleSave} disabled={loading} className="gap-2 px-8 h-14 font-black uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(0,229,255,0.2)]">
                        <Save size={18} />
                        {loading ? "Synchronizing..." : "Apply Config"}
                    </Button>
                </div>
            </div>

            <Toast isVisible={toast.show} message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />
        </div>
    );
}
