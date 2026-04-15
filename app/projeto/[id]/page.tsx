"use client"

import { use, useState, useMemo, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, ExternalLink, Send, Ellipsis } from "lucide-react"
import { useRouter } from "next/navigation"
import { useMutation, useQuery } from "@apollo/client/react"

import { Navbar } from "@/components/navbar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"

import { useMe } from "@/lib/graphql/hooks/useUser"
import { useProjects } from "@/lib/graphql/hooks/useProjects"

import {
	CREATE_COMMENT,
	DELETE_COMMENT,
	UPDATE_COMMENT,
} from "@/lib/graphql/mutations/comment"

import {
	FOLLOW_USER,
	UNFOLLOW_USER,
} from "@/lib/graphql/mutations/user"

import {
	LIKE_PROJECT,
	UNLIKE_PROJECT,
	DELETE_PROJECT,
} from "@/lib/graphql/mutations/project"

import { GET_PROJECT_COMMENTS } from "@/lib/graphql/queries/comment"
import { adaptProject } from "@/lib/adapters/project-adapter"

type Comment = {
	id: string
	text: string
	createdAt: number
	author: {
		id: string
		name: string
	}
}

type GetCommentsResponse = {
	projectComments: {
		id: string
		text: string
		createdAt: number
		user: {
			id: string
			name: string
		}
	}[]
}

type CreateCommentResponse = {
	createComment: {
		id: string
		text: string
		createdAt: string
		user: {
			name: string
		}
	}
}

function formatDate(dateInput: string | number) {
	const date = new Date(Number(dateInput))

	if (isNaN(date.getTime())) {
		console.log("Data inválida recebida:", dateInput)
		return "Data inválida"
	}

	return date.toLocaleString("pt-BR", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	})
}

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = use(params)
	const router = useRouter()

	const { data: meData } = useMe()
	const user = meData?.me

	const { data: projectsData, loading } = useProjects()
	const projects = useMemo(
		() => (projectsData?.projects || []).map(adaptProject),
		[projectsData]
	)
	const project = projects.find((p) => p.id === id)

	const { data: commentsData } = useQuery<GetCommentsResponse>(
		GET_PROJECT_COMMENTS,
		{ variables: { projectId: id } }
	)

	const [comments, setComments] = useState<Comment[]>([])
	const [newComment, setNewComment] = useState("")
	const [editingCommentId, setEditingCommentId] = useState<string | null>(null)

	const [followUser] = useMutation(FOLLOW_USER)
	const [unfollowUser] = useMutation(UNFOLLOW_USER)

	const [isFollowing, setIsFollowing] = useState(false)
	const [followersCount, setFollowersCount] = useState(0)


	const [liked, setLiked] = useState(false)
	const [likeCount, setLikeCount] = useState(0)

	const [deleteProject] = useMutation(DELETE_PROJECT)

	const [openMenuId, setOpenMenuId] = useState<string | null>(null)

	const [createComment] = useMutation<CreateCommentResponse>(CREATE_COMMENT)
	const [deleteComment] = useMutation(DELETE_COMMENT)
	const [updateComment] = useMutation(UPDATE_COMMENT)


	useEffect(() => {
		if (!project) return

		setFollowersCount(project.author.followers)
		setIsFollowing(false)
	}, [project])
	const toggleFollow = async () => {
		if (!project) return
		try {
			if (!isFollowing) {
				await followUser({
					variables: { userId: project.author.id },
				})

				setFollowersCount(prev => prev + 1)
			} else {
				await unfollowUser({
					variables: { userId: project.author.id },
				})

				setFollowersCount(prev => prev - 1)
			}

			setIsFollowing(!isFollowing)
		} catch (error) {
			console.error("Erro ao seguir:", error)
		}
	}
	useEffect(() => {
		if (!project) return

		setLiked(project.liked)
		setLikeCount(project.likes)
	}, [project])

	useEffect(() => {
		if (!commentsData?.projectComments) return
		setComments(
			commentsData.projectComments.map((c) => ({
				id: c.id,
				text: c.text,
				createdAt: Number(c.createdAt),
				author: {
					id: c.user.id,
					name: c.user.name,
				},
			}))
		)
	}, [commentsData])

	useEffect(() => {
		const handleClickOutside = () => setOpenMenuId(null)

		window.addEventListener("click", handleClickOutside)
		return () => window.removeEventListener("click", handleClickOutside)
	}, [])

	if (loading) return <div className="min-h-screen flex items-center justify-center">Carregando...</div>
	if (!project) return <div className="min-h-screen flex items-center justify-center">Projeto não encontrado</div>
	if (!user) return null

	const handleProjectEdit = () => {
		router.push(`/projeto/novo?id=${project.id}`)
	}

	const safeProject = project

	const handleDelete = async (commentId: string) => {
		try {
			await deleteComment({
				variables: { commentId },
				refetchQueries: ["GetProjectComments"],
			})
		} catch (error) {
			console.error("Erro ao deletar:", error)
		}
	}

	const handleEdit = (comment: Comment) => {
		setNewComment(comment.text)
		setEditingCommentId(comment.id)
	}
	const handleProjectDelete = async () => {
		try {
			await deleteProject({
				variables: { projectId: project.id },
			})

			window.location.href = "/feed"
		} catch (error) {
			console.error("Erro ao deletar projeto:", error)
		}
	}

	const addComment = async () => {
		if (!newComment.trim() || !user || !project) return

		try {
			if (editingCommentId) {
				await updateComment({
					variables: {
						commentId: editingCommentId,
						text: newComment,
					},
					refetchQueries: ["GetProjectComments"],
				})

				setEditingCommentId(null)
			} else {
				await createComment({
					variables: {
						projectId: project.id,
						text: newComment,
					},
					refetchQueries: ["GetProjectComments"],
				})
			}

			setNewComment("")
		} catch (error) {
			console.error("Erro:", error)
		}
	}

	return (
		<div className="min-h-screen bg-background">
			<Navbar />

			<main className="mx-auto max-w-4xl px-4 py-5 sm:py-6">
				<Link
					href="/feed"
					className="mb-5 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-all duration-200 hover:-translate-x-0.5 animate-fade-in sm:mb-6"
				>
					<ArrowLeft className="size-4" />
					Voltar ao feed
				</Link>

				<div className="flex flex-col gap-6 lg:flex-row">
					<article className="flex-1 min-w-0">
						<div className="overflow-hidden rounded-xl border border-border bg-card animate-scale-in">
							<div className="relative h-48 bg-gradient-to-br from-gold/20 via-coral/15 to-sunset/10 overflow-hidden sm:h-72">
								{project.image ? (
									<img
										src={project.image}
										alt={project.title}
										className="absolute inset-0 size-full object-cover"
									/>
								) : (
									<div className="absolute inset-0 flex items-center justify-center">
										<div className="text-center animate-fade-in-up delay-200">
											<div className="mx-auto mb-3 flex size-16 items-center justify-center rounded-2xl bg-gold/10 backdrop-blur-sm border border-gold/20 animate-float sm:size-20">
												<span className="font-serif text-2xl font-bold text-gold sm:text-3xl">
													{project.title.charAt(0)}
												</span>
											</div>
											<Badge variant="secondary" className="text-xs">
												{project.category}
											</Badge>
										</div>
									</div>
								)}
								<div className="absolute top-6 right-8 animate-float delay-200">
									<div className="size-2 rounded-full bg-gold/30" />
								</div>
								<div className="absolute bottom-8 left-12 animate-float delay-500">
									<div className="size-1.5 rounded-full bg-coral/25" />
								</div>
							</div>

							<div className="p-4 sm:p-6">
								<div className="flex items-start justify-between">
									<h1 className="font-serif text-xl font-bold text-foreground leading-tight sm:text-2xl lg:text-3xl">
										{project.title}
									</h1>
									{project.author.id === user.id && (
										<div className="relative">
											<button
												onClick={(e) => {
													e.stopPropagation()
													setOpenMenuId(openMenuId === "project" ? null : "project")
												}}
												className="p-2 rounded-md hover:bg-secondary"
											>
												<Ellipsis className="size-4" />
											</button>

											{openMenuId === "project" && (
												<div
													onClick={(e) => e.stopPropagation()}
													className="absolute right-0 mt-1 w-28 bg-card border border-border rounded-md shadow-md z-10"
												>
													<button
														onClick={() => {
															handleProjectEdit()
															setOpenMenuId(null)
														}}
														className="w-full text-left px-3 py-2 text-xs hover:bg-secondary"
													>
														Editar
													</button>

													<button
														onClick={() => {
															handleProjectDelete()
															setOpenMenuId(null)
														}}
														className="w-full text-left px-3 py-2 text-xs hover:bg-secondary text-red-500"
													>
														Excluir
													</button>
												</div>
											)}
										</div>
									)}
								</div>
								<div className="mt-5">
									<h2 className="text-sm font-semibold mb-2">Sobre o projeto</h2>
									<p className="text-sm text-muted-foreground leading-relaxed">
										{project.description}
									</p>
								</div>
								{project.link && (
									<div className="mt-5">
										<a
											href={project.link}
											target="_blank"
											rel="noopener noreferrer"
											className="inline-flex items-center gap-2 rounded-lg bg-secondary px-4 py-2.5 text-sm font-medium text-secondary-foreground hover:bg-gold/10 hover:text-gold transition-all duration-200"
										>
											<ExternalLink className="size-4" />
											Ver projeto completo
										</a>
									</div>
								)}
							</div>
						</div>
						<div className="mt-6 rounded-xl border border-border bg-card p-4 sm:p-6">
							<h2 className="font-serif text-lg font-semibold mb-5">
								Comentários ({comments.length})
							</h2>

							<div className="flex gap-3 mb-6">
								<Avatar className="size-8 border border-border">
									{user && (
										<AvatarFallback className="bg-gold/10 text-gold text-[10px] font-semibold">
											{user.name
												.split(" ")
												.map((n: string) => n[0])
												.join("")}
										</AvatarFallback>
									)}
								</Avatar>

								<div className="flex-1">
									<Textarea
										placeholder="Escreva um comentario..."
										value={newComment}
										onChange={(e) => setNewComment(e.target.value)}
									/>

									<div className="mt-2 flex justify-end">
										<Button
											size="sm"
											onClick={addComment}
											disabled={!newComment.trim()}
											className="gap-1.5 bg-gold text-white"
										>
											<Send className="size-3.5" />
											{editingCommentId ? "Salvar" : "Comentar"}
										</Button>
									</div>
								</div>
							</div>

							{comments.length > 0 ? (
								<div className="flex flex-col gap-4">
									{comments.map((comment, index) => (
										<div key={comment.id}>
											{index > 0 && <Separator className="mb-4" />}

											<div className="flex gap-3">
												<Avatar className="size-8 border border-border">
													<AvatarFallback className="bg-gold/10 text-gold text-[10px] font-semibold">
														{(comment.author?.name ?? "Usuário")
															.split(" ")
															.map((n: string) => n[0])
															.join("")}
													</AvatarFallback>
												</Avatar>

												<div className="flex-1">
													<div className="flex items-center justify-between w-full">
														<div className="flex items-center gap-2">
															<span className="text-sm font-medium">
																{comment.author.name}
															</span>
															<span className="text-xs text-muted-foreground">
																{formatDate(comment.createdAt)}
															</span>
														</div>
														{comment.author.id === user.id && (
															<div className="relative">
																<button
																	onClick={(e) => {
																		e.stopPropagation()
																		setOpenMenuId(openMenuId === comment.id ? null : comment.id)
																	}}
																	className="p-2 rounded-md hover:bg-secondary"
																>
																	<Ellipsis className="size-4" />
																</button>

																{openMenuId === comment.id && (
																	<div
																		onClick={(e) => e.stopPropagation()}
																		className="absolute right-0 mt-1 w-28 bg-card border border-border rounded-md shadow-md z-10"
																	>
																		<button
																			onClick={() => {
																				handleEdit(comment)
																				setOpenMenuId(null)
																			}}
																			className="w-full text-left px-3 py-2 text-xs hover:bg-secondary"
																		>
																			Editar
																		</button>

																		<button
																			onClick={() => {
																				handleDelete(comment.id)
																				setOpenMenuId(null)
																			}}
																			className="w-full text-left px-3 py-2 text-xs hover:bg-secondary text-red-500"
																		>
																			Excluir
																		</button>
																	</div>
																)}
															</div>
														)}
													</div>

													<p className="mt-1 text-sm text-muted-foreground">
														{comment.text}
													</p>
												</div>
											</div>
										</div>
									))}
								</div>
							) : (
								<p className="text-center text-sm text-muted-foreground py-6">
									Nenhum comentario ainda. Seja o primeiro a comentar!
								</p>
							)}
						</div>
					</article>
					<aside className="w-full lg:w-64 shrink-0">
						<div className="sticky top-20 rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:shadow-md hover:shadow-gold/5">

							<h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
								Autor
							</h3>

							<div className="flex flex-col items-center gap-3 text-center">

								<Link href={`/perfil/${project.author.id}`}>
									<Avatar className="size-16 border-2 border-gold/30 transition-all duration-300 hover:scale-105 hover:border-gold/60 animate-pulse-glow">
										<AvatarFallback className="bg-gold/10 text-gold text-[10px] font-semibold">
											{project.author.name.split(" ").map(n => n[0]).join("")}
										</AvatarFallback>
									</Avatar>
								</Link>

								<div>
									<Link
										href={`/perfil/${project.author.id}`}
										className="font-serif text-sm font-semibold text-foreground hover:text-primary transition-colors"
									>
										{project.author.name}
									</Link>
									<p className="text-xs text-muted-foreground mt-0.5">
										{project.author.role}
									</p>
								</div>

								<p className="text-xs text-muted-foreground leading-relaxed">
									{project.author.bio}
								</p>

								<div className="flex w-full justify-around border-t border-border pt-3 mt-1">
									<div className="text-center group/stat cursor-default">
										<p className="text-sm font-bold">{project.author.projectCount}</p>
										<p className="text-[10px] text-muted-foreground">Projetos</p>
									</div>

									<div className="text-center group/stat cursor-default">
										<p className="text-sm font-bold text-foreground transition-colors duration-200 group-hover/stat:text-gold">{followersCount}</p>
										<p className="text-[10px] text-muted-foreground">Seguidores</p>
									</div>
								</div>

								<Link href={`/perfil/${project.author.id}`} className="w-full">
									<Button variant="outline" size="sm" className="w-full text-xs mt-1 btn-press transition-all duration-200 hover:border-gold/40 hover:text-gold">
										Ver perfil completo
									</Button>
								</Link>
								<Button
									onClick={toggleFollow}
									size="sm"
									className={`w-full text-xs mt-2 btn-press transition-all duration-200 ${isFollowing
										? "bg-secondary text-foreground hover:bg-destructive/10"
										: "bg-gold text-white hover:bg-gold-light"
										}`}
								>
									{isFollowing ? "Deixar de seguir" : "Seguir"}
								</Button>

							</div>
						</div>
					</aside>
				</div>
			</main>
		</div>
	)
}