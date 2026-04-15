"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { TrendingUp, Users, Sparkles } from "lucide-react"

import { Navbar } from "@/components/navbar"
import { ProjectCard } from "@/components/project-card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

import { useProjects } from "@/lib/graphql/hooks/useProjects"
import { useMe } from "@/lib/graphql/hooks/useUser"
import { adaptProject } from "@/lib/adapters/project-adapter"
import { useSearch } from "@/lib/search-context"
import { cn } from "@/lib/utils"

const CATEGORIES = [
	"Todos",
	"Design",
	"Programação",
	"Marketing",
	"UI/UX",
	"Branding",
]

export default function FeedPage() {
	const [activeCategory, setActiveCategory] = useState("Todos")

	const { data: userData, loading: userLoading } = useMe()
	const { data: projectsData, loading: projectsLoading } = useProjects()
	const { query, isSearching } = useSearch()

	const user = userData?.me

	const projects = useMemo(() => {
		if (!projectsData?.projects) return []
		return projectsData.projects.map(adaptProject)
	}, [projectsData])

	const filteredByCategory = useMemo(() => {
		if (activeCategory === "Todos") return projects

		return projects.filter(
			(project) => project.category === activeCategory
		)
	}, [projects, activeCategory])

	const displayedProjects = useMemo(() => {
		if (!isSearching) return filteredByCategory

		const lowerQuery = query.toLowerCase()

		return filteredByCategory.filter((project) =>
			project.title.toLowerCase().includes(lowerQuery) ||
			project.description.toLowerCase().includes(lowerQuery) ||
			project.author.name.toLowerCase().includes(lowerQuery) ||
			project.category.toLowerCase().includes(lowerQuery)
		)
	}, [filteredByCategory, query, isSearching])

	useEffect(() => {
		if (isSearching && activeCategory !== "Todos") {
			setActiveCategory("Todos")
		}
	}, [isSearching, activeCategory])

	if (projectsLoading || userLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				Carregando...
			</div>
		)
	}

	if (!user) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				Usuário não autenticado
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-background">
			<Navbar />

			<main className="mx-auto max-w-6xl px-4 py-5 sm:py-6">
				<div className="flex gap-6">
					<aside className="hidden w-64 shrink-0 lg:block animate-slide-in-left">
						<div className="rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:shadow-md hover:shadow-gold/5">
							<div className="flex flex-col items-center gap-3">
								<Avatar className="size-16 border-2 border-gold/30 transition-transform duration-300 hover:scale-105 animate-pulse-glow">
									<AvatarFallback className="bg-gold/10 text-gold text-lg font-semibold">
										{user.name.split(" ").map((n: string) => n[0]).join("")}
									</AvatarFallback>
								</Avatar>
								<div className="text-center">
									<h3 className="font-serif text-sm font-semibold text-foreground">{user.name}</h3>
									<p className="text-xs text-muted-foreground">{user.area}</p>
								</div>
								<div className="mt-1 flex w-full justify-around border-t border-border pt-3">
									<div className="text-center">
										<p className="text-sm font-bold text-foreground">{user.projectsCount}</p>
										<p className="text-[10px] text-muted-foreground">Projetos</p>
									</div>
									<div className="text-center">
										<p className="text-sm font-bold text-foreground">{user.followersCount}</p>
										<p className="text-[10px] text-muted-foreground">Seguidores</p>
									</div>
									<div className="text-center">
										<p className="text-sm font-bold text-foreground">{user.followingCount}</p>
										<p className="text-[10px] text-muted-foreground">Seguindo</p>
									</div>
								</div>
							</div>
							<Link href={`/perfil/${user.id}`} className="block mt-4">
								<Button
									variant="outline"
									size="sm"
									className="w-full text-xs btn-press transition-all duration-200 hover:border-gold/40 hover:text-gold"
								>
									Ver perfil
								</Button>
							</Link>
						</div>

						<div className="mt-4 rounded-xl border border-border bg-card p-5 animate-slide-in-left delay-150 transition-all duration-300 hover:shadow-md hover:shadow-gold/5">
							<h4 className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
								<TrendingUp className="size-4 text-gold" />
								Em alta
							</h4>
							<div className="flex flex-col gap-1">
								{["UI/UX", "Branding", "Fotografia"].map((cat) => (
									<button
										key={cat}
										onClick={() => setActiveCategory(cat)}
										className={cn(
											"flex items-center gap-2 rounded-lg px-3 py-2 text-xs transition-all duration-200 text-left",
											activeCategory === cat
												? "bg-gold/10 text-gold font-medium"
												: "text-muted-foreground hover:bg-secondary hover:text-foreground"
										)}
									>
										<Sparkles
											className={cn(
												"size-3 transition-colors",
												activeCategory === cat ? "text-gold" : "text-muted-foreground/50"
											)}
										/>
										{cat}
									</button>
								))}
							</div>
						</div>
					</aside>

					<div className="flex-1 min-w-0">
						<div className="mb-5 flex gap-2 overflow-x-auto pb-2 scrollbar-none animate-fade-in-down sm:mb-6">
							{CATEGORIES.map((cat) => (
								<button
									key={cat}
									onClick={() => setActiveCategory(cat)}
									className={cn(
										"shrink-0 rounded-full px-4 py-2 text-xs font-medium transition-all duration-250 btn-press",
										activeCategory === cat
											? "bg-gold text-[#FFFFFF] shadow-md shadow-gold/20"
											: "bg-secondary text-secondary-foreground hover:bg-gold/10 hover:text-gold"
									)}
								>
									{cat}
								</button>
							))}
						</div>

						{displayedProjects.length > 0 ? (
							<div
								className="grid gap-4 sm:grid-cols-2 sm:gap-5"
								key={activeCategory + (isSearching ? query : "")}
							>
								{displayedProjects.map((project, i) => (
									<ProjectCard key={project.id} project={project} index={i} />
								))}
							</div>
						) : (
							<div className="flex flex-col items-center justify-center py-20 text-center animate-scale-in">
								<div className="mb-4 flex size-16 items-center justify-center rounded-full bg-secondary animate-float">
									<Sparkles className="size-6 text-muted-foreground" />
								</div>
								<h3 className="font-serif text-lg font-semibold text-foreground">
									Nenhum projeto encontrado
								</h3>
								<p className="mt-1 text-sm text-muted-foreground">
									Nao ha projetos nesta categoria ainda.
								</p>
								<Button
									variant="outline"
									size="sm"
									className="mt-4 btn-press"
									onClick={() => setActiveCategory("Todos")}
								>
									Ver todos
								</Button>
							</div>
						)}
					</div>

					<aside className="hidden w-60 shrink-0 xl:block animate-slide-in-right">
						<div className="rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:shadow-md hover:shadow-gold/5">
							<h4 className="flex items-center gap-2 text-sm font-semibold text-foreground mb-4">
								<Users className="size-4 text-gold" />
								Freelancers em destaque
							</h4>
							<div className="flex flex-col gap-1">
								{[user].map((u, i) => (
									<Link
										key={u.id}
										href={`/perfil/${u.id}`}
										className="flex items-center gap-3 rounded-lg p-2 transition-all duration-200 hover:bg-secondary hover:translate-x-1 animate-fade-in-up"
										style={{ animationDelay: `${200 + i * 80}ms` }}
									>
										<Avatar className="size-8 border border-border transition-transform duration-200 hover:scale-110">
											<AvatarFallback className="bg-gold/10 text-gold text-[10px] font-semibold">
												{u.name.split(" ").map((n: string) => n[0]).join("")}
											</AvatarFallback>
										</Avatar>
										<div className="min-w-0">
											<p className="text-xs font-medium text-foreground truncate">{u.name}</p>
											<p className="text-[10px] text-muted-foreground truncate">{u.area}</p>
										</div>
									</Link>
								))}
							</div>
						</div>

						<div className="mt-4 px-2 animate-fade-in delay-600">
							<p className="text-[10px] text-muted-foreground leading-relaxed">
								Aglaea - Rede Social para Freelancers. Conectando talentos a oportunidades.
							</p>
						</div>
					</aside>
				</div>
			</main>
		</div>
	)
}