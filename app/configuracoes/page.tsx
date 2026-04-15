'use client'
import { useState, useEffect } from 'react'
import { useMe } from '@/lib/graphql/hooks/useUser'
import { ChevronRight, Settings, Palette, Shield, LogOut, Eye, EyeOff, Bell, Lock } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { ThemeToggle } from '@/components/theme-toggle'
import { EditProfileDialog } from '@/components/edit-profile-dialog'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'

export default function SettingsPage() {
	const [currentPassword, setCurrentPassword] = useState("")
	const [newPassword, setNewPassword] = useState("")
	const [confirmPassword, setConfirmPassword] = useState("")
	const { data } = useMe()
	const user = data?.me
	const [showPasswords, setShowPasswords] = useState({
		current: false,
		new: false,
		confirm: false,
	})
	const [isChangingPassword, setIsChangingPassword] = useState(false)
	const [profileOpen, setProfileOpen] = useState(false)
	const [notificationsEnabled, setNotificationsEnabled] = useState({
		email: true,
		projects: true,
		messages: true,
		follows: true,
	})
	const { toast } = useToast()

	const handleLogout = () => {
		localStorage.removeItem("token")
		window.location.href = "/login"
	}

	const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		if (newPassword !== confirmPassword) {
			toast({
				title: "Erro",
				description: "As senhas não coincidem",
				variant: "destructive",
			})
			setIsChangingPassword(false)
			return
		}

		setIsChangingPassword(true)
		try {
			await new Promise((resolve) => setTimeout(resolve, 1000))
			toast({
				title: 'Sucesso',
				description: 'Sua senha foi alterada com sucesso.',
			})
			setIsChangingPassword(false)
		} finally {
			setIsChangingPassword(false)
		}
	}

	const handleNotificationToggle = (key: keyof typeof notificationsEnabled) => {
		setNotificationsEnabled((prev) => ({
			...prev,
			[key]: !prev[key],
		}))
	}
	useEffect(() => {
		localStorage.setItem("notifications", JSON.stringify(notificationsEnabled))
	}, [notificationsEnabled])

	if (!user) {
		return <div className="min-h-screen flex items-center justify-center">Carregando...</div>
	}

	return (
		<div className="min-h-screen bg-background">
			<Navbar />

			<main className="mx-auto max-w-2xl px-4 py-6 sm:py-8">
				<div className="mb-8 animate-fade-in-down">
					<h1 className="font-serif text-3xl font-bold text-foreground">
						Configurações
					</h1>
					<p className="mt-1 text-muted-foreground">
						Gerencie sua conta e preferências
					</p>
				</div>

				<div className="mb-8 space-y-4 animate-fade-in-up delay-100">
					<div className="rounded-xl border border-border bg-card p-6">
						<h2 className="mb-4 font-serif text-lg font-semibold text-foreground flex items-center gap-2">
							<Settings className="size-5 text-gold" />
							Meu Perfil
						</h2>

						<div className="mb-6 flex items-center gap-4">
							<Avatar className="size-16 border-2 border-gold/30">
								<AvatarFallback className="bg-gold/10 text-gold text-lg font-bold">
									{user.name?.split(' ').map(n => n[0]).join('') || "U"}
								</AvatarFallback>
							</Avatar>
							<div className="flex-1">
								<h3 className="font-semibold text-foreground">{user.name}</h3>
								<p className="text-sm text-muted-foreground">{user.email}</p>
								<p className="text-sm text-gold mt-1">{user.area}</p>
							</div>
						</div>

						<EditProfileDialog isOpen={profileOpen} onOpenChange={setProfileOpen} />
					</div>
				</div>

				<div className="mb-8 space-y-4 animate-fade-in-up delay-200">
					<div className="rounded-xl border border-border bg-card p-6">
						<h2 className="mb-4 font-serif text-lg font-semibold text-foreground flex items-center gap-2">
							<Palette className="size-5 text-gold" />
							Aparência
						</h2>

						<div className="space-y-4">
							<div className="space-y-2">
								<label className="text-sm font-medium text-foreground">
									Tema
								</label>
								<ThemeToggle />
							</div>
							<p className="text-xs text-muted-foreground">
								Escolha entre tema claro, escuro ou deixe o seu sistema decidir
							</p>
						</div>
					</div>
				</div>

				<div className="mb-8 space-y-4 animate-fade-in-up delay-300">
					<div className="rounded-xl border border-border bg-card p-6">
						<h2 className="mb-4 font-serif text-lg font-semibold text-foreground flex items-center gap-2">
							<Bell className="size-5 text-gold" />
							Notificações
						</h2>

						<div className="space-y-4">
							{[
								{
									key: 'email' as const,
									label: 'Notificações por Email',
									description: 'Receba atualizações importantes por email',
								}
							].map((notification) => (
								<div
									key={notification.key}
									className="flex items-center justify-between rounded-lg p-3 hover:bg-secondary transition-colors duration-200"
								>
									<div className="flex-1">
										<p className="text-sm font-medium text-foreground">
											{notification.label}
										</p>
										<p className="text-xs text-muted-foreground">
											{notification.description}
										</p>
									</div>
									<Switch
										checked={notificationsEnabled[notification.key]}
										onCheckedChange={() => handleNotificationToggle(notification.key)}
										className="ml-2"
									/>
								</div>
							))}
						</div>
					</div>
				</div>

				<div className="mb-8 space-y-4 animate-fade-in-up delay-400">
					<div className="rounded-xl border border-border bg-card p-6">
						<h2 className="mb-4 font-serif text-lg font-semibold text-foreground flex items-center gap-2">
							<Shield className="size-5 text-gold" />
							Privacidade e Segurança
						</h2>

						<div className="space-y-2">
							<Dialog>
								<DialogTrigger asChild>
									<button className="w-full flex items-center justify-between rounded-lg p-3 hover:bg-secondary transition-colors duration-200 group">
										<span className="text-sm font-medium text-foreground flex items-center gap-2">
											<Lock className="size-4" />
											Alterar senha
										</span>
										<ChevronRight className="size-4 text-muted-foreground group-hover:text-foreground transition-colors duration-200" />
									</button>
								</DialogTrigger>
								<DialogContent className="max-w-md animate-scale-in">
									<DialogHeader>
										<DialogTitle className="font-serif text-xl">Alterar senha</DialogTitle>
										<DialogDescription>
											Escolha uma senha forte e segura
										</DialogDescription>
									</DialogHeader>

									<form onSubmit={handlePasswordChange} className="space-y-4">
										<div className="space-y-2 relative">
											<label className="text-sm font-medium text-foreground">
												Senha Atual
											</label>
											<div className="relative">
												<Input
													type={showPasswords.current ? 'text' : 'password'}
													placeholder="Digite sua senha atual"
													required
													value={currentPassword}
													onChange={(e) => setCurrentPassword(e.target.value)}
												/>
												<button
													type="button"
													onClick={() =>
														setShowPasswords(prev => ({
															...prev,
															current: !prev.current
														}))
													}
													className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200"
												>
													{showPasswords.current ? (
														<EyeOff className="size-4" />
													) : (
														<Eye className="size-4" />
													)}
												</button>
											</div>
										</div>

										<div className="space-y-2 relative">
											<label className="text-sm font-medium text-foreground">
												Nova Senha
											</label>
											<div className="relative">
												<Input
													type={showPasswords.new ? 'text' : 'password'}
													placeholder="Digite a nova senha"
													required
													minLength={8}
													value={newPassword}
													onChange={(e) => setNewPassword(e.target.value)}
												/>
												<button
													type="button"
													onClick={() =>
														setShowPasswords(prev => ({
															...prev,
															new: !prev.new
														}))
													}
													className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200"
												>
													{showPasswords.new ? (
														<EyeOff className="size-4" />
													) : (
														<Eye className="size-4" />
													)}
												</button>
											</div>
										</div>

										<div className="space-y-2 relative">
											<label className="text-sm font-medium text-foreground">
												Confirmar Senha
											</label>
											<div className="relative">

												<Input
													type={showPasswords.confirm ? 'text' : 'password'}
													placeholder="Confirme a nova senha"
													required
													value={confirmPassword}
													onChange={(e) => setConfirmPassword(e.target.value)}
												/>
												<button
													type="button"
													onClick={() =>
														setShowPasswords(prev => ({
															...prev,
															confirm: !prev.confirm
														}))
													}
													className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200"
												>
													{showPasswords.confirm ? (
														<EyeOff className="size-4" />
													) : (
														<Eye className="size-4" />
													)}
												</button>
											</div>
										</div>

										<div className="flex gap-2 pt-2">
											<DialogTrigger asChild>
												<Button
													type="button"
													variant="outline"
													className="flex-1"
												>
													Cancelar
												</Button>
											</DialogTrigger>
											<Button
												type="submit"
												className="flex-1 gap-2 bg-gold text-white hover:bg-gold-light btn-press"
												disabled={
													isChangingPassword ||
													!currentPassword ||
													!newPassword ||
													!confirmPassword
												}
											>
												{isChangingPassword ? 'Salvando...' : 'Salvar'}
											</Button>
										</div>
									</form>
								</DialogContent>
							</Dialog>

							<button className="w-full flex items-center justify-between rounded-lg p-3 hover:bg-secondary transition-colors duration-200 group">
								<span className="text-sm font-medium text-foreground">
									Privacidade do perfil
								</span>
								<ChevronRight className="size-4 text-muted-foreground group-hover:text-foreground transition-colors duration-200" />
							</button>
						</div>
					</div>
				</div>

				<div className="space-y-4 animate-fade-in-up delay-500">
					<div className="rounded-xl border border-border bg-card p-6">
						<h2 className="mb-4 font-serif text-lg font-semibold text-foreground flex items-center gap-2">
							<LogOut className="size-5 text-coral" />
							Sessão
						</h2>
						<Button
							onClick={handleLogout}
							variant="outline"
							className="w-full gap-2 text-destructive hover:text-destructive border-destructive/50 hover:bg-destructive/10"
						>
							<LogOut className="size-4" />
							Sair da conta
						</Button>
					</div>
				</div>
			</main>
		</div>
	)
}

