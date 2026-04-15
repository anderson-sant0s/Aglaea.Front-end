"use client"

import { use } from "react"
import { FOLLOW_USER, UNFOLLOW_USER } from "@/lib/graphql/mutations/user"
import { useMutation } from "@apollo/client/react"
import { useMe } from "@/lib/graphql/hooks/useUser"
import { useState, useEffect } from "react"
import { Mail, Calendar } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { ProjectCard } from "@/components/project-card"
import { EditProfileDialog } from "@/components/edit-profile-dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useUser } from "@/lib/graphql/hooks/useUser"
import { useProjects } from "@/lib/graphql/hooks/useProjects"
import { adaptProject } from "@/lib/adapters/project-adapter"
import { useLikedProjects } from "@/lib/graphql/hooks/useLikedProjects"

export default function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = use(params)

	const { data: meData } = useMe()
	const { data, loading } = useUser(id)
	const { data: projectsData } = useProjects()
	const { data: likedData } = useLikedProjects()

	const [followUser] = useMutation(FOLLOW_USER)
	const [unfollowUser] = useMutation(UNFOLLOW_USER)
	const [isFollowing, setIsFollowing] = useState(false)
	const [followersCount, setFollowersCount] = useState(0)

	const me = meData?.me
	const user = data?.user

	useEffect(() => {
		if (!user) return

		setFollowersCount(user.followersCount)
		setIsFollowing(false)
	}, [user])

	if (loading || !user) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				Carregando...
			</div>
		)
	}

	const projects = (projectsData?.projects || []).map(adaptProject)
	const likedProjects = (likedData?.likedProjects || []).map(adaptProject)

	const memberSince = new Date(user.createdAt).toLocaleDateString("pt-BR", { month: "long", year: "numeric", })

	const userProjects = projects.filter((p) => p.author.id === user.id)

	const isOwnProfile = me?.id === user?.id

	const toggleFollow = async () => {
		if (!user || !me) return

		if (user.id === me.id) return

		try {
			if (!isFollowing) {
				await followUser({
					variables: { userId: user.id },
				})

				setFollowersCount(prev => prev + 1)
			} else {
				await unfollowUser({
					variables: { userId: user.id },
				})

				setFollowersCount(prev => prev - 1)
			}

			setIsFollowing(!isFollowing)
		} catch (error) {
			console.error("Erro ao seguir:", error)
		}
	}

	return (
		<div className="min-h-screen bg-background">
			<Navbar />

			<main className="mx-auto max-w-4xl px-4 py-5 sm:py-6">
				<div className="rounded-xl border border-border bg-card overflow-hidden animate-scale-in">

					<div className="relative h-28 bg-gradient-to-r from-gold/30 via-coral/20 to-sunset/30 sm:h-40">
						<div className="absolute inset-0 bg-gradient-to-b from-transparent to-card/50" />

						<div className="absolute top-4 right-8 animate-float">
							<div className="size-2 rounded-full bg-gold/40" />
						</div>
						<div className="absolute top-8 right-16 animate-float delay-300">
							<div className="size-1.5 rounded-full bg-sunset/30" />
						</div>
						<div className="absolute top-6 left-12 animate-float delay-500">
							<div className="size-2 rounded-full bg-coral/30" />
						</div>
					</div>

					<div className="relative px-4 pb-5 sm:px-6 sm:pb-6">
						<div className="flex flex-col items-start gap-3 sm:flex-row sm:items-end sm:gap-5">
							<Avatar className="-mt-10 size-20 border-4 border-card ring-2 ring-gold/20 transition-transform duration-300 hover:scale-105 animate-pulse-glow sm:-mt-14 sm:size-28">
								<AvatarFallback className="bg-gold/10 text-gold text-xl font-bold sm:text-2xl">
									{user.name.split(" ").map(n => n[0]).join("")}
								</AvatarFallback>
							</Avatar>

							<div className="flex flex-1 flex-col gap-2 pt-1 sm:flex-row sm:items-start sm:justify-between sm:pt-2">
								<div className="animate-fade-in-up delay-100">
									<h1 className="font-serif text-xl font-bold text-foreground sm:text-2xl">
										{user.name}
									</h1>
									<p className="text-sm text-gold font-medium">
										{user.area}
									</p>
								</div>

								<div className="animate-fade-in delay-200">
									{isOwnProfile ? (
										<EditProfileDialog />
									) : (
										<Button
											onClick={toggleFollow}
											disabled={isOwnProfile}
											className={`transition-all duration-200 ${isFollowing
												? "bg-secondary text-foreground hover:bg-destructive/10"
												: "bg-gold text-white hover:bg-gold-light"
												}`}
										>
											{isFollowing ? "Deixar de seguir" : "Seguir"}
										</Button>
									)}
								</div>
							</div>
						</div>

						<p className="mt-4 text-sm text-muted-foreground max-w-xl">
							{user.description || "Sem bio ainda."}
						</p>

						<div className="mt-4 flex flex-wrap items-center gap-3">
							<Badge variant="secondary">{user.area}</Badge>

							{user.contact && (
								<span className="flex items-center gap-1 text-xs text-muted-foreground">
									<Mail className="size-3" />
									{user.contact}
								</span>
							)}

							<span className="flex items-center gap-1 text-xs text-muted-foreground">
								<Calendar className="size-3" />
								Membro desde {new Date(Number(user.createdAt)).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" })}
							</span>
						</div>

						<div className="mt-5 flex gap-6 border-t border-border pt-5">
							<div>
								<p className="font-bold">{user.projectsCount}</p>
								<p className="text-xs text-muted-foreground">Projetos</p>
							</div>
							<div>
								<p className="font-bold">{followersCount}</p>
								<p className="text-xs text-muted-foreground">Seguidores</p>
							</div>
							<div>
								<p className="font-bold">{user.followingCount}</p>
								<p className="text-xs text-muted-foreground">Seguindo</p>
							</div>
						</div>
					</div>
				</div>

				<div className="mt-6">
					<Tabs defaultValue="projetos">
						<TabsList className="w-full justify-start bg-card border border-border">
							<TabsTrigger value="projetos">
								Projetos ({userProjects.length})
							</TabsTrigger>
							<TabsTrigger value="curtidos">
								Curtidos ({likedProjects.length})
							</TabsTrigger>
						</TabsList>

						<TabsContent value="projetos" className="mt-4">
							{userProjects.length > 0 ? (
								<div className="grid gap-4 sm:grid-cols-2">
									{userProjects.map((project, i) => (
										<ProjectCard key={project.id} project={project} index={i} />
									))}
								</div>
							) : (
								<p className="text-center mt-10 text-muted-foreground">
									Nenhum projeto publicado
								</p>
							)}
						</TabsContent>

						<TabsContent value="curtidos" className="mt-4">
							{likedProjects.length > 0 ? (
								<div className="grid gap-4 sm:grid-cols-2">
									{likedProjects.map((project, i) => (
										<ProjectCard key={project.id} project={project} index={i} />
									))}
								</div>
							) : (
								<div className="flex flex-col items-center justify-center py-16 text-center">
									<h3 className="font-serif text-lg font-semibold text-foreground">
										Nenhum projeto curtido
									</h3>
									<p className="mt-1 text-sm text-muted-foreground">
										Explore o feed e curta projetos que você gosta!
									</p>
								</div>
							)}
						</TabsContent>
					</Tabs>
				</div>
			</main>
		</div>
	)
}