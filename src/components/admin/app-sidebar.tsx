"use client"

import { AlertTriangle, BookOpen, Bot, Command, Frame, GalleryVerticalEnd, LifeBuoy, Map, Package, PieChart, PlusCircle, Send, Settings2, SquareTerminal, } from "lucide-react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, } from "@/components/ui/sidebar";
import { NavSecondary } from "@/components/admin/nav-secondary";
import { NavProjects } from "@/components/admin/nav-project";
import { NavMain } from "@/components/admin/nav-main";
import { NavUser } from "@/components/user/nav-user";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import { Skeleton } from "../ui/skeleton";
import * as React from "react";
import Link from "next/link";

const data = {
    navMain: [
        {
            title: "Dashboard",
            url: "/admin",
            icon: SquareTerminal,
            isActive: true,
            items: [],
        },
        {
            title: "Orders",
            url: "/admin/orders",
            icon: Send,
            items: [
                {
                    title: "All Orders",
                    url: "/admin/orders",
                },
                {
                    title: "Pending",
                    url: "/admin/orders?status=pending",
                },
                {
                    title: "Completed",
                    url: "/admin/orders?status=completed",
                },
            ],
        },
        {
            title: "Products",
            url: "/admin/products",
            icon: PieChart,
            items: [
                {
                    title: "All Products",
                    url: "/admin/products",
                },
                {
                    title: "Add Product",
                    url: "/admin/products/new",
                },
                {
                    title: "Categories",
                    url: "/admin/categories",
                },
            ],
        },
        {
            title: "Inventory",
            url: "/admin/ingredients",
            icon: Package,
            items: [
                {
                    title: "Ingredients",
                    url: "/admin/ingredients",
                },
                {
                    title: "Suppliers",
                    url: "/admin/suppliers",
                },
                {
                    title: "Stock Levels",
                    url: "/admin/stock",
                },
            ],
        },
        {
            title: "Recipes",
            url: "/admin/recipes",
            icon: BookOpen,
            items: [
                {
                    title: "All Recipes",
                    url: "/admin/recipes",
                },
                {
                    title: "Ingredients",
                    url: "/admin/ingredients",
                },
                {
                    title: "Suppliers",
                    url: "/admin/suppliers",
                },
            ],
        },
        {
            title: "Customers",
            url: "/admin/customers",
            icon: Map,
            items: [
                {
                    title: "Customer List",
                    url: "/admin/customers",
                },
                {
                    title: "Feedback",
                    url: "/admin/feedback",
                },
            ],
        },
        {
            title: "Settings",
            url: "/admin/settings",
            icon: Settings2,
            items: [
                {
                    title: "Shop Settings",
                    url: "/admin/settings",
                },
                {
                    title: "Team",
                    url: "/admin/team",
                },
                {
                    title: "Billing",
                    url: "/admin/billing",
                },
            ],
        }

    ],
    navSecondary: [
        {
            title: "New Ingredient",
            url: "/admin/ingredients/new",
            icon: PlusCircle,
        },
        {
            title: "Low Stock Alerts",
            url: "/admin/stock/alerts",
            icon: AlertTriangle,
        },
        {
            title: "Help",
            url: "/admin/help",
            icon: LifeBuoy,
        },
        {
            title: "Contact Us",
            url: "/admin/contact",
            icon: Send,
        },
    ],
    projects: [
        {
            name: "Website",
            url: "/admin/website",
            icon: Frame,
        },
        {
            name: "Instagram Shop",
            url: "/admin/social/instagram",
            icon: Bot,
        },
        {
            name: "Local Events",
            url: "/admin/events",
            icon: Command,
        },
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

    const { data: session, isPending, error, } = authClient.useSession()
    if (error) {
        console.error("Error fetching session:", error);
        return <div>Error loading session</div>;
    };

    if (isPending) {
        return (
            <Sidebar variant="inset" {...props}>
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton size="lg" asChild>
                                <div className="flex items-center space-x-2">
                                    <Skeleton className="size-8 rounded-lg" />
                                    <div className="space-y-1">
                                        <Skeleton className="h-4 w-24" />
                                    </div>
                                </div>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>

                <SidebarContent>
                    <div className="space-y-4 p-4">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <Skeleton key={i} className="h-8 w-full rounded-md" />
                        ))}
                    </div>
                </SidebarContent>

                <SidebarFooter className="p-4">
                    <div className="flex items-center space-x-2">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                </SidebarFooter>
            </Sidebar>
        )
    };

    if (!session) {
        redirect("/login")
    };

    return (
        <Sidebar variant="inset" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/">
                                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                                    <GalleryVerticalEnd className="size-4" />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">DeeCake</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
                <NavProjects projects={data.projects} />
                <NavSecondary items={data.navSecondary} className="mt-auto" />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={session!.user} />
            </SidebarFooter>
        </Sidebar>
    )
}
