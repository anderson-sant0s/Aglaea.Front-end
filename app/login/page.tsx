"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/graphql/hooks/useAuth"

export default function LoginPage() {
	const router = useRouter()
	const { login, loginState } = useAuth()
	const [showPassword, setShowPassword] = useState(false)
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [isSubmitting, setIsSubmitting] = useState(false)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsSubmitting(true)

		try {
			const data = await login(email, password)

			if (data) {
				localStorage.setItem("token", data.token)

				router.push("/feed")
			}
		} catch (error) {
			console.error("Erro no login:", error)
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<div className="flex min-h-screen">
			<div className="relative hidden lg:flex lg:w-1/2 items-center justify-center overflow-hidden">
				<img
					src="/images/auth-bg.jpg"
					alt="Fundo criativo com tons de por do sol"
					className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] ease-out hover:scale-105"
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-[#1A1310]/80 via-[#1A1310]/30 to-transparent" />

				<div className="absolute top-12 right-12 animate-float">
					<div className="flex size-10 items-center justify-center rounded-full bg-gold/20 backdrop-blur-sm">
						<Sparkles className="size-5 text-gold-light" />
					</div>
				</div>
				<div className="absolute top-1/3 left-10 animate-float delay-500">
					<div className="size-3 rounded-full bg-coral/40" />
				</div>
				<div className="absolute top-1/2 right-20 animate-float delay-300">
					<div className="size-2 rounded-full bg-gold-light/50" />
				</div>

				<div className="relative z-10 flex flex-col items-start gap-6 px-12 pb-16 mt-auto self-end">
					<h1 className="animate-fade-in-up font-serif text-5xl font-bold text-[#FFF8F0] text-balance leading-tight">
						Bem-vindo de volta ao{" "}
						<span className="animate-gold-shimmer">Aglaea</span>
					</h1>
					<p className="animate-fade-in-up delay-200 max-w-md text-lg leading-relaxed text-[#FFF8F0]/80">
						Sua plataforma criativa para conectar talentos e oportunidades.
					</p>
				</div>
			</div>

			<div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2 bg-background">
				<div className="w-full max-w-md">
					<div className="mb-10 animate-fade-in-down">
						<h2 className="font-serif text-3xl font-bold text-foreground">
							Aglaea
						</h2>
						<p className="mt-2 text-muted-foreground">
							Entre na sua conta para continuar
						</p>
					</div>

					<div className="mb-6 lg:hidden animate-fade-in-up">
						<p className="text-sm text-gold font-medium">
							Bem-vindo de volta
						</p>
					</div>

					<form onSubmit={handleSubmit} className="flex flex-col gap-5">
						<div className="flex flex-col gap-2 animate-fade-in-up delay-100">
							<Label htmlFor="email">E-mail</Label>
							<Input
								id="email"
								type="email"
								placeholder="seu@email.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="h-12 transition-all duration-200 focus:ring-2 focus:ring-gold/20 focus:border-gold"
							/>
						</div>

						<div className="flex flex-col gap-2 animate-fade-in-up delay-200">
							<div className="flex items-center justify-between">
								<Label htmlFor="password">Senha</Label>
								<Link
									href="#"
									className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
								>
									Esqueceu a senha?
								</Link>
							</div>
							<div className="relative">
								<Input
									id="password"
									type={showPassword ? "text" : "password"}
									placeholder="Digite sua senha"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className="h-12 pr-10 transition-all duration-200 focus:ring-2 focus:ring-gold/20 focus:border-gold"
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200"
									aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
								>
									{showPassword ? (
										<EyeOff className="size-4" />
									) : (
										<Eye className="size-4" />
									)}
								</button>
							</div>
						</div>

						<div className="animate-fade-in-up delay-300">
							<Button
								type="submit"
								size="lg"
								disabled={loginState.loading}
								className="w-full h-12 bg-gold text-[#FFFFFF] hover:bg-gold-light font-semibold btn-press transition-all duration-300 hover:shadow-lg hover:shadow-gold/20 disabled:opacity-70"
							>
								{loginState.loading ? (
									<span className="flex items-center gap-2">
										<span className="size-4 border-2 border-[#FFFFFF]/30 border-t-[#FFFFFF] rounded-full animate-spin" />
										Entrando...
									</span>
								) : (
									<>
										Entrar
										<ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
									</>
								)}
							</Button>
							{loginState.error && (
								<p className="text-sm text-red-500 mt-2">
									Email ou senha inválidos
								</p>
							)}
						</div>
					</form>

					<div className="mt-8 flex items-center gap-4 animate-fade-in delay-400">
						<div className="h-px flex-1 bg-border" />
						<span className="text-sm text-muted-foreground">ou</span>
						<div className="h-px flex-1 bg-border" />
					</div>

					<div className="mt-6 text-center animate-fade-in delay-500">
						<p className="text-sm text-muted-foreground">
							Ainda nao tem uma conta?{" "}
							<Link
								href="/registro"
								className="font-semibold text-primary hover:text-primary/80 transition-colors underline-offset-4 hover:underline"
							>
								Criar conta
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}
