"use client"

import { useAuth } from "@/lib/graphql/hooks/useAuth"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"

const areas = [
	"Design",
	"Programação",
	"Marketing",
	"Edição de Video",
	"Fotografia",
	"Ilustração",
	"UI/UX",
	"Branding",
	"Outro",
]

export default function RegistroPage() {
	const { register, registerState } = useAuth()
	const router = useRouter()
	const [showPassword, setShowPassword] = useState(false)
	const [name, setName] = useState("")
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [area, setArea] = useState("")
	const [isSubmitting, setIsSubmitting] = useState(false)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!name || !email || !password) return

		try {
			const data = await register(name, email, password)

			if (data) {
				router.push("/login?created=true")
			}
		} catch (error) {
			console.error("Erro no registro:", error)
		}
	}

	return (
		<div className="flex min-h-screen">
			<div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2 bg-[#1A1310]">
				<div className="w-full max-w-md">
					<div className="mb-10 animate-fade-in-down">
						<h2 className="font-serif text-3xl font-bold text-[#FFF8F0]">
							Aglaea
						</h2>
						<p className="mt-2 text-[#A89580]">
							Crie sua conta e comece a compartilhar
						</p>
					</div>

					<div className="mb-6 lg:hidden animate-fade-in-up">
						<p className="text-sm text-gold font-medium">
							Crie sua conta
						</p>
					</div>

					<form onSubmit={handleSubmit} className="flex flex-col gap-5">
						<div className="flex flex-col gap-2 animate-fade-in-up delay-75">
							<Label htmlFor="name" className="text-[#FFF8F0]">Nome completo</Label>
							<Input
								id="name"
								type="text"
								placeholder="Seu nome"
								value={name}
								onChange={(e) => setName(e.target.value)}
								className="h-12 bg-[#231C16] border-[#3A2E24] text-[#FFF8F0] transition-all duration-200 focus:ring-2 focus:ring-gold/20 focus:border-gold"
							/>
						</div>

						<div className="flex flex-col gap-2 animate-fade-in-up delay-150">
							<Label htmlFor="email" className="text-[#FFF8F0]">E-mail</Label>
							<Input
								id="email"
								type="email"
								placeholder="seu@email.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="h-12 bg-[#231C16] border-[#3A2E24] text-[#FFF8F0] transition-all duration-200 focus:ring-2 focus:ring-gold/20 focus:border-gold"
							/>
						</div>

						<div className="flex flex-col gap-2 animate-fade-in-up delay-200">
							<Label htmlFor="area" className="text-[#FFF8F0]">Area de atuacao</Label>
							<Select value={area} onValueChange={setArea}>
								<SelectTrigger className="h-12 bg-[#231C16] border-[#3A2E24] text-[#FFF8F0] transition-all duration-200 focus:ring-2 focus:ring-gold/20 focus:border-gold">
									<SelectValue placeholder="Selecione sua area" />
								</SelectTrigger>
								<SelectContent>
									{areas.map((a) => (
										<SelectItem key={a} value={a}>
											{a}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="flex flex-col gap-2 animate-fade-in-up delay-250">
							<Label htmlFor="password" className="text-[#FFF8F0]">Senha</Label>
							<div className="relative">
								<Input
									id="password"
									type={showPassword ? "text" : "password"}
									placeholder="Crie uma senha forte"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className="h-12 pr-10 bg-[#231C16] border-[#3A2E24] text-[#FFF8F0] transition-all duration-200 focus:ring-2 focus:ring-gold/20 focus:border-gold"
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A89580] hover:text-[#FFF8F0] transition-colors duration-200"
									aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
								>
									{showPassword ? (
										<EyeOff className="size-4" />
									) : (
										<Eye className="size-4" />
									)}
								</button>
								{registerState.error && (
									<p className="text-sm text-red-400 mt-2">
										{registerState.error.message || "Erro ao criar conta"}
									</p>
								)}
							</div>
						</div>

						<div className="animate-fade-in-up delay-300">
							<Button
								type="submit"
								size="lg"
								disabled={registerState.loading || !name || !email || !password}
								className="w-full h-12 bg-gold text-[#1A1310] hover:bg-gold-light font-semibold btn-press transition-all duration-300 hover:shadow-lg hover:shadow-gold/20 disabled:opacity-70"
							>
								{registerState.loading ? (
									<span className="flex items-center gap-2">
										<span className="size-4 border-2 border-[#1A1310]/30 border-t-[#1A1310] rounded-full animate-spin" />
										Criando conta...
									</span>
								) : (
									<>
										Criar conta
										<ArrowRight className="size-4" />
									</>
								)}
							</Button>
						</div>
					</form>

					<div className="mt-8 flex items-center gap-4 animate-fade-in delay-400">
						<div className="h-px flex-1 bg-[#3A2E24]" />
						<span className="text-sm text-[#A89580]">ou</span>
						<div className="h-px flex-1 bg-[#3A2E24]" />
					</div>

					<div className="mt-6 text-center animate-fade-in delay-500">
						<p className="text-sm text-[#A89580]">
							Ja tem uma conta?{" "}
							<Link
								href="/login"
								className="font-semibold text-gold hover:text-gold-light transition-colors underline-offset-4 hover:underline"
							>
								Entrar
							</Link>
						</p>
					</div>
				</div>
			</div>

			<div className="relative hidden lg:flex lg:w-1/2 items-center justify-center overflow-hidden">
				<img
					src="/images/image.png"
					alt="Fundo criativo com tons de por do sol"
					className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] ease-out hover:scale-105"
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-[#000000]/70 via-[#000000]/40 to-transparent" />

				<div className="absolute bottom-1/3 right-12 animate-float delay-700">
					<div className="size-3 rounded-full bg-sunset/40" />
				</div>
				<div className="absolute top-1/4 right-1/3 animate-float delay-400">
					<div className="size-2 rounded-full bg-gold-light/50" />
				</div>

				<div className="relative z-10 flex flex-col items-start gap-6 px-12 pb-16 mt-auto self-end">
					<div className="flex items-center gap-3">
						<Sparkles className="size-8 text-gold-light animate-float" />
						<h1 className="animate-fade-in-up font-serif text-5xl font-bold text-[#FFF8F0] text-balance leading-tight">
							Junte-se ao{" "}
							<span className="animate-gold-shimmer">Aglaea</span>
						</h1>
					</div>
					<p className="animate-fade-in-up delay-200 max-w-md text-lg leading-relaxed text-[#FFF8F0]/80">
						Crie seu perfil profissional, compartilhe seus projetos e conecte-se com oportunidades incriveis.
					</p>
				</div>
			</div>
		</div>
	)
}
