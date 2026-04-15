"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Heart, MessageCircle, ExternalLink, Bookmark } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { useMutation } from "@apollo/client/react"
import { LIKE_PROJECT, UNLIKE_PROJECT } from "@/lib/graphql/mutations/project"
import { cn } from "@/lib/utils"

const categoryColors: Record<string, string> = {
	"Design": "bg-[#E85D3A]/10 text-[#E85D3A] border-[#E85D3A]/20",
	"Programacao": "bg-[#2D7A4F]/10 text-[#2D7A4F] border-[#2D7A4F]/20",
	"Marketing": "bg-[#C8842D]/10 text-[#C8842D] border-[#C8842D]/20",
	"Edicao de Video": "bg-[#7B4DAA]/10 text-[#7B4DAA] border-[#7B4DAA]/20",
	"Fotografia": "bg-[#3A7BE8]/10 text-[#3A7BE8] border-[#3A7BE8]/20",
	"Ilustracao": "bg-[#E85D8A]/10 text-[#E85D8A] border-[#E85D8A]/20",
	"UI/UX": "bg-[#E85D3A]/10 text-[#E85D3A] border-[#E85D3A]/20",
	"Branding": "bg-[#C8842D]/10 text-[#C8842D] border-[#C8842D]/20",
}

export type ProjectCardType = {
	id: string
	title: string
	description: string
	category: string
	createdAt: string

	author: {
		id: string
		name: string
		role: string
		bio: string
		projectCount: number
		followers: number
	}

	commentsCount: number
	comments: any[]
	liked: boolean
	likes: number
	image: string | null
	link: string | null
}

function getProjectGradient(id: string) {
	const gradients = [
		"from-[#C8842D]/20 via-[#E85D3A]/15 to-[#FF7B54]/10",
		"from-[#E85D3A]/20 via-[#C8842D]/15 to-[#D4A853]/10",
		"from-[#D4A853]/20 via-[#FF7B54]/15 to-[#E85D3A]/10",
		"from-[#FF7B54]/20 via-[#D4A853]/15 to-[#C8842D]/10",
		"from-[#C8842D]/15 via-[#D4A853]/20 to-[#FF7B54]/10",
		"from-[#E85D3A]/15 via-[#FF7B54]/20 to-[#D4A853]/10",
	]
	const index = parseInt(id) % gradients.length
	return gradients[index]
}

interface ProjectCardProps {
	project: ProjectCardType
	index?: number
}

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
	const [unlikeProject] = useMutation(UNLIKE_PROJECT)
	const [likeProject] = useMutation(LIKE_PROJECT)

	const [liked, setLiked] = useState(project.liked)
	const [likeCount, setLikeCount] = useState(project.likes)
	const [saved, setSaved] = useState(false)
	const [heartAnimating, setHeartAnimating] = useState(false)
	const heartRef = useRef<HTMLButtonElement>(null)

	const toggleLike = async () => {
		try {
			if (liked) {
				await unlikeProject({
					variables: { projectId: project.id },
					refetchQueries: ["GetProjects"],
				})
				setLikeCount((prev) => prev - 1)
			} else {
				await likeProject({
					variables: { projectId: project.id },
					refetchQueries: ["GetProjects"],
				})
				setLikeCount((prev) => prev + 1)
			}

			setLiked(!liked)
		} catch (error) {
			console.error("Erro ao curtir:", error)
			toast.error("Erro ao atualizar like")
		}
	}

	useEffect(() => {
		try {
			const raw = localStorage.getItem("savedProjects")
			const list: string[] = raw ? JSON.parse(raw) : []
			setSaved(list.includes(project.id))
		} catch (e) {
			// ignore
		}
	}, [project.id])

	function handleToggleSaved() {
		try {
			const raw = localStorage.getItem("savedProjects")
			const list: string[] = raw ? JSON.parse(raw) : []
			const exists = list.includes(project.id)
			const next = exists ? list.filter((id) => id !== project.id) : [project.id, ...list]
			localStorage.setItem("savedProjects", JSON.stringify(next))
			setSaved(!exists)
			toast.success(exists ? "Removido dos salvos" : "Salvo nos seus projetos")
		} catch (e) {
			toast.error("Erro ao atualizar salvos")
		}
	}

	const staggerDelay = Math.min(index * 80, 400)

	return (
		<article
			className="group overflow-hidden rounded-xl border border-border bg-card card-hover animate-fade-in-up"
			style={{ animationDelay: `${staggerDelay}ms` }}
		>
			<Link href={`/projeto/${project.id}`}>
				<div className={cn(
					"relative h-44 bg-gradient-to-br overflow-hidden sm:h-48",
					getProjectGradient(project.id),
				)}>
					{project.image ? (
						<img
							src={project.image}
							alt={project.title}
							className="absolute inset-0 size-full object-cover"
						/>
					) : (
						<div className="absolute inset-0 flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
							<div className="text-center">
								<div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-gold/10 transition-all duration-300 group-hover:bg-gold/20 group-hover:shadow-lg group-hover:shadow-gold/10">
									<span className="font-serif text-lg font-bold text-gold">
										{project.title.charAt(0)}
									</span>
								</div>
								<p className="text-xs text-muted-foreground transition-opacity duration-300 group-hover:opacity-70">
									{project.category}
								</p>
							</div>
						</div>
					)}
					<div className="absolute top-3 right-3 transition-transform duration-300 group-hover:translate-y-0 -translate-y-1 opacity-0 group-hover:opacity-100">
						<Badge
							variant="outline"
							className={cn(
								"text-[10px] backdrop-blur-sm",
								categoryColors[project.category] || "bg-muted text-muted-foreground"
							)}
						>
							{project.category}
						</Badge>
					</div>
					<div className="absolute inset-0 bg-foreground/0 transition-colors duration-300 group-hover:bg-foreground/5" />
				</div>
			</Link>

			<div className="flex flex-col gap-3 p-4">
				<div className="flex items-center gap-2">
					<Link href={`/perfil/${project.author.id}`}>
						<Avatar className="size-7 border border-border transition-transform duration-200 hover:scale-110">
							<AvatarFallback className="bg-gold/10 text-gold text-[10px] font-semibold">
								{project.author.name.split(" ").map(n => n[0]).join("")}
							</AvatarFallback>
						</Avatar>
					</Link>
					<div className="flex flex-col min-w-0">
						<Link
							href={`/perfil/${project.author.id}`}
							className="text-xs font-medium text-foreground hover:text-primary transition-colors truncate"
						>
							{project.author.name}
						</Link>
						<span className="text-[10px] text-muted-foreground truncate">{project.author.role}</span>
					</div>
				</div>

				<div>
					<Link href={`/projeto/${project.id}`}>
						<h3 className="font-serif text-base font-semibold text-foreground leading-snug hover:text-primary transition-colors text-balance line-clamp-2">
							{project.title}
						</h3>
					</Link>
					<p className="mt-1 text-xs text-muted-foreground leading-relaxed line-clamp-2">
						{project.description}
					</p>
				</div>

				<div className="flex items-center justify-between pt-1 border-t border-border/50">
					<div className="flex items-center gap-3">
						<button
							ref={heartRef}
							onClick={toggleLike}
							className="flex items-center gap-1 text-xs text-muted-foreground hover:text-coral transition-colors"
							aria-label={liked ? "Descurtir" : "Curtir"}
						>
							<Heart
								className={cn(
									"size-4 transition-all",
									liked && "fill-coral text-coral",
									heartAnimating && "animate-heart-pop"
								)}
							/>
							<span className={cn(
								"transition-colors",
								liked && "text-coral font-medium"
							)}>{likeCount}</span>
						</button>

						<Link
							href={`/projeto/${project.id}`}
							className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
						>
							<MessageCircle className="size-4" />
							<span>{project.commentsCount}</span>
						</Link>

						{project.link && (
							<a
								href={project.link}
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
								aria-label="Link externo"
							>
								<ExternalLink className="size-3.5" />
							</a>
						)}
					</div>
				</div>
			</div>
		</article>
	)
}
