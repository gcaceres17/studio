'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { Users, Calendar, BarChart as BarChartIcon, Activity } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { mockCustomers, mockReservations } from "@/lib/mock-data";
import { useAuth } from "@/hooks/useAuth";
import { useMemo } from "react";
import { format } from "date-fns";

export default function DashboardPage() {
    const { user } = useAuth();
    
    const reservationsData = useMemo(() => {
        const data: { [key: string]: number } = {};
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const formattedDate = format(date, 'MMM dd');
            data[formattedDate] = 0;
        }

        mockReservations.forEach(res => {
            const formattedDate = format(res.date, 'MMM dd');
            if(data.hasOwnProperty(formattedDate)) {
                data[formattedDate]++;
            }
        });

        return Object.keys(data).map(key => ({ name: key, total: data[key] }));
    }, []);
    
    const totalCustomers = mockCustomers.length;
    const totalReservations = mockReservations.length;
    const upcomingReservations = mockReservations.filter(r => r.date > new Date() && r.status === 'confirmed').length;

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <PageHeader
                title={`Welcome back, ${user?.displayName || 'User'}!`}
                description="Here's a summary of your business activities."
            />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalCustomers}</div>
                        <p className="text-xs text-muted-foreground">+2 new this month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Reservations</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalReservations}</div>
                        <p className="text-xs text-muted-foreground">Across all time</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Upcoming Reservations</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+{upcomingReservations}</div>
                        <p className="text-xs text-muted-foreground">In the next 30 days</p>
                    </CardContent>
                </Card>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BarChartIcon className="h-5 w-5" />
                        Reservations Overview
                    </CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={reservationsData}>
                            <XAxis
                                dataKey="name"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `${value}`}
                            />
                            <Tooltip
                                cursor={{ fill: 'hsl(var(--secondary))' }}
                                contentStyle={{ 
                                    background: 'hsl(var(--background))', 
                                    border: '1px solid hsl(var(--border))',
                                    borderRadius: 'var(--radius)'
                                }}
                            />
                            <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}
