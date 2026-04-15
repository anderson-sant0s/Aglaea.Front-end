"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Search, Bell, Plus, User, LogOut, Home, Menu, X, Settings, ExternalLink, Heart, MessageCircle, UserPlus, Folder, Info } from "lucide-react"
import { useNotifications } from "@/lib/graphql/hooks/useNotifications"
import { useMutation } from "@apollo/client/react"
import { MARK_AS_READ, MARK_ALL_AS_READ } from "@/lib/graphql/mutations/notification"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useSearch } from "@/lib/search-context"
import { cn } from "@/lib/utils"
import { useMe } from "@/lib/graphql/hooks/useUser";

export function Navbar() {
	const { data: meData } = useMe()
	const { data: notificationsData, refetch } = useNotifications()
	const user = meData?.me
	const notifications = notificationsData?.notifications || []
	const pathname = usePathname()
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
	const [searchFocused, setSearchFocused] = useState(false)
	const [notificationsOpen, setNotificationsOpen] = useState(false)

	const unreadCount = notifications.filter((n) => !n.read).length
	const { query, setQuery } = useSearch()
	const router = useRouter()

	const [markAsReadMutation] = useMutation(MARK_AS_READ)
	const [markAllMutation] = useMutation(MARK_ALL_AS_READ)

	const handleNotificationClick = async (notification: any) => {
		await markAsReadMutation({
			variables: { id: notification.id }
		})

		await refetch()
		setNotificationsOpen(false)

		if (notification.project?.id) {
			router.push(`/projeto/${notification.project.id}`)
		} else if (notification.actor?.id) {
			router.push(`/perfil/${notification.actor.id}`)
		}
	}

	const handleMarkAllRead = async () => {
		await markAllMutation()
		await refetch()
	}

	const getNotificationIcon = (type: string) => {
		switch (type) {
			case 'like':
				return Heart
			case 'comment':
				return MessageCircle
			case 'follow':
				return UserPlus
			case 'project':
				return Folder
			case 'system':
				return Info
			default:
				return Bell
		}
	}

	return (
		<header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 animate-fade-in-down">
			<nav className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:h-16">
				<Link href="/feed" className="shrink-0 group">
					<h1 className="font-serif text-xl font-bold text-foreground transition-colors duration-200 group-hover:text-gold sm:text-2xl">
						Aglaea
					</h1>
				</Link>

				<div className={cn(
					"hidden flex-1 max-w-md md:block transition-all duration-300",
					searchFocused && "max-w-lg"
				)}>
					<div className="relative">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground transition-colors duration-200" />
						<Input
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							placeholder="Buscar projetos, freelancers..."
							className="h-9 pl-9 bg-secondary border-0 transition-all duration-300 focus:ring-2 focus:ring-gold/20 focus:bg-card"
							onFocus={() => setSearchFocused(true)}
							onBlur={() => setSearchFocused(false)}
						/>
					</div>
				</div>

				{/* Actions */}
				<div className="flex items-center gap-1 sm:gap-2">
					<Button
						variant="ghost"
						size="icon"
						className="md:hidden size-9 transition-colors duration-200"
						aria-label="Buscar"
					>
						<Search className="size-5" />
					</Button>

					<Link href="/feed">
						<Button
							variant="ghost"
							size="icon"
							className={cn(
								"size-9 transition-all duration-200",
								pathname === "/feed" && "text-gold bg-gold/10"
							)}
							aria-label="Feed"
						>
							<Home className="size-5" />
						</Button>
					</Link>

					<DropdownMenu open={notificationsOpen} onOpenChange={setNotificationsOpen}>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className="relative size-9 transition-colors duration-200"
								aria-label="Notificacoes"
							>
								<Bell className="size-5" />
								{unreadCount > 0 && (
									<span className="absolute top-1.5 right-1.5 flex size-2.5 items-center justify-center">
										<span className="absolute inline-flex size-full animate-ping rounded-full bg-coral/60" />
										<span className="relative inline-flex size-2 rounded-full bg-coral" />
									</span>
								)}
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-80 animate-scale-in max-h-96 overflow-y-auto">
							<div className="flex items-center justify-between px-3 py-2 border-b border-border">
								<h4 className="text-sm font-semibold text-foreground">Notificacoes</h4>
								{unreadCount > 0 && (
									<Button
										variant="ghost"
										size="sm"
										className="text-xs h-7 px-2"
										onClick={handleMarkAllRead}
									>
										Marcar todas como lidas
									</Button>
								)}
							</div>
							{notifications.length === 0 ? (
								<div className="px-3 py-6 text-center text-sm text-muted-foreground">
									Nenhuma notificacao
								</div>
							) : (
								notifications.map((notification) => (
									<DropdownMenuItem
										key={notification.id}
										className={`flex items-start gap-3 p-3 cursor-pointer ${!notification.read ? 'bg-secondary/50' : ''}`}
										onClick={() => handleNotificationClick(notification)}
									>
										<div className="flex-shrink-0 flex items-center justify-center">
											{(() => {
												const Icon = getNotificationIcon(notification.type)
												return <Icon className="size-5 text-gold" />
											})()}
										</div>
										<div className="flex-1 min-w-0">
											<p className="text-sm font-medium text-foreground">
												{notification.message}
											</p>
										</div>
										{!notification.read && (
											<div className="flex-shrink-0">
												<div className="size-2 rounded-full bg-coral" />
											</div>
										)}
									</DropdownMenuItem>
								))
							)}
						</DropdownMenuContent>
					</DropdownMenu>

					<Link href="/projeto/novo" className="hidden sm:block">
						<Button
							size="sm"
							className="gap-1.5 bg-gold text-[#FFFFFF] hover:bg-gold-light font-medium btn-press transition-all duration-300 hover:shadow-md hover:shadow-gold/15 h-9"
						>
							<Plus className="size-4" />
							Publicar
						</Button>
					</Link>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<button
								className="flex items-center gap-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring transition-transform duration-200 hover:scale-105"
								aria-label="Menu do usuario"
							>
								<Avatar className="size-8 border-2 border-gold/30 transition-all duration-200 hover:border-gold/60">
									<AvatarFallback className="bg-gold/10 text-gold text-xs font-semibold">
										{user?.name
											? user.name.split(" ").map(n => n[0]).join("")
											: "..."
										}
									</AvatarFallback>
								</Avatar>
							</button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-48 animate-scale-in">
							<DropdownMenuItem asChild>
								{user && (
									<Link href={user ? `/perfil/${user.id}` : "/login"} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2">
										<User className="size-4" />
										Meu Perfil
									</Link>
								)}
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<Link href="/configuracoes" className="flex items-center gap-2">
									<Settings className="size-4" />
									Configurações
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem asChild className="sm:hidden">
								<Link href="/projeto/novo" className="flex items-center gap-2">
									<Plus className="size-4" />
									Publicar projeto
								</Link>
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem asChild>
								<Link href="/login" className="flex items-center gap-2 text-destructive">
									<LogOut className="size-4" />
									Sair
								</Link>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</nav>
		</header>
	)
}
