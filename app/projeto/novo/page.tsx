"use client"

import { useQuery } from "@apollo/client/react"
import { GET_PROJECT } from "@/lib/graphql/queries/project"
import { useMutation } from "@apollo/client/react"
import { CREATE_PROJECT, UPDATE_PROJECT } from "@/lib/graphql/mutations/project"
import { useSearchParams, useRouter } from "next/navigation"
import { useState, useRef, useEffect, useSyncExternalStore } from "react"
import Link from "next/link"
import {
	ArrowLeft,
	Upload,
	Link2,
	Sparkles,
	Eye,
	Check,
	Loader2,
} from "lucide-react"
import {
	CreateProjectResponse,
	UpdateProjectResponse
} from "@/lib/graphql/types/project"
import { toast } from "sonner"
import { Navbar } from "@/components/navbar"
import { useMe } from "@/lib/graphql/hooks/useUser"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { GetProjectResponse } from "@/lib/graphql/types/project"

const publishCategories = ["Design", "Programação", "Marketing", "UI/UX", "Branding"]

export default function PublishPage() {
	const router = useRouter()
	const fileInputRef = useRef<HTMLInputElement>(null)
	const [createProject] = useMutation<CreateProjectResponse>(CREATE_PROJECT)
	const [updateProject] = useMutation<UpdateProjectResponse>(UPDATE_PROJECT)
	const [title, setTitle] = useState("")
	const [description, setDescription] = useState("")
	const [category, setCategory] = useState("")
	const [link, setLink] = useState("")
	const [coverPreview, setCoverPreview] = useState<string | null>(null)
	const [isDragging, setIsDragging] = useState(false)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [showPreview, setShowPreview] = useState(false)
	const searchParams = useSearchParams()
	const projectId = searchParams.get("id")
	const isEditing = !!projectId
	const isValid = title.trim().length >= 3 && description.trim().length >= 10 && category !== ""
	const { data: meData } = useMe()
	const user = meData?.me


	const { data: projectData } = useQuery<GetProjectResponse>(GET_PROJECT, {
		variables: { id: projectId },
		skip: !projectId
	})

	useEffect(() => {
		if (!projectData?.project) return

		const project = projectData.project

		setTitle(project.title)
		setDescription(project.description)
		setCategory(project.category || "")
		setLink(project.link || "")
		setCoverPreview(project.images?.[0] || null)
	}, [projectData])

	async function handlePublish() {
		if (!isValid) return
		setIsSubmitting(true)

		try {
			let newProjectId = projectId

			if (isEditing) {
				const res = await updateProject({
					variables: {
						projectId,
						title,
						description,
						category,
						link,
						images: coverPreview ? [coverPreview] : []
					}
				})

				if (!res.data?.updateProject?.id) {
					throw new Error("Erro ao criar projeto")
				}

				newProjectId = res.data.updateProject.id
			} else {
				const res = await createProject({
					variables: {
						title,
						description,
						category,
						link,
						images: coverPreview ? [coverPreview] : []
					}
				})

				if (!res.data?.createProject?.id) {
					throw new Error("Erro ao criar projeto")
				}

				newProjectId = res.data.createProject.id
			}

			toast.success("Projeto publicado!")

			router.push(`/projeto/${newProjectId}`)

		} catch (err) {
			console.error(err)
			toast.error("Erro ao publicar")
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<div className="min-h-screen bg-background">
			<Navbar />

			<main className="mx-auto max-w-3xl px-4 py-6 sm:py-10">
				{/* Header */}
				<div className="mb-8 animate-fade-in-up">
					<Link
						href="/feed"
						className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
					>
						<ArrowLeft className="size-4" />
						Voltar ao feed
					</Link>
					<h1 className="font-serif text-2xl font-bold text-foreground sm:text-3xl text-balance">
						{isEditing ? "Editar projeto" : "Publicar projeto"}
					</h1>
					<p className="mt-1 text-sm text-muted-foreground">
						Mostre seu trabalho para a comunidade de freelancers.
					</p>
				</div>

				<div className="flex flex-col gap-6 lg:flex-row lg:gap-10">
					<div className="flex-1 flex flex-col gap-6">

						{/* Title */}

						<div className="animate-fade-in-up delay-200">
							<Label htmlFor="title" className="mb-2 block text-sm font-medium text-foreground">
								Titulo do projeto <span className="text-coral">*</span>
							</Label>
							<Input
								id="title"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								placeholder="Ex: Redesign App de Fintech"
								className="h-12 bg-card transition-all duration-200 focus:ring-2 focus:ring-gold/20"
								maxLength={100}
							/>
							<p className="mt-1 text-xs text-muted-foreground text-right">
								{title.length}/100
							</p>
						</div>

						{/* Description */}
						<div className="animate-fade-in-up delay-300">
							<Label htmlFor="desc" className="mb-2 block text-sm font-medium text-foreground">
								Descricao <span className="text-coral">*</span>
							</Label>
							<Textarea
								id="desc"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								placeholder="Conte sobre o projeto, processo criativo, ferramentas usadas..."
								className="min-h-32 bg-card resize-none transition-all duration-200 focus:ring-2 focus:ring-gold/20"
								maxLength={600}
							/>
							<p className="mt-1 text-xs text-muted-foreground text-right">
								{description.length}/600
							</p>
						</div>

						{/* Category */}
						<div className="animate-fade-in-up delay-400">
							<Label className="mb-2 block text-sm font-medium text-foreground">
								Categoria <span className="text-coral">*</span>
							</Label>
							<div className="flex flex-wrap gap-2">
								{publishCategories.map((cat) => (
									<button
										key={cat}
										type="button"
										onClick={() => setCategory(category === cat ? "" : cat)}
										className={cn(
											"rounded-full px-4 py-2 text-xs font-medium transition-all duration-200 btn-press",
											category === cat
												? "bg-gold text-[#FFFFFF] shadow-md shadow-gold/20 scale-105"
												: "bg-secondary text-secondary-foreground hover:bg-gold/10 hover:text-gold"
										)}
									>
										{category === cat && <Check className="inline-block size-3 mr-1 -ml-0.5" />}
										{cat}
									</button>
								))}
							</div>
						</div>

						{/* Link */}
						<div className="animate-fade-in-up delay-500">
							<Label htmlFor="link" className="mb-2 block text-sm font-medium text-foreground">
								Link do projeto
							</Label>
							<div className="relative">
								<Link2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
								<Input
									id="link"
									value={link}
									onChange={(e) => setLink(e.target.value)}
									placeholder="https://exemplo/seu-projeto"
									className="h-12 pl-10 bg-card transition-all duration-200 focus:ring-2 focus:ring-gold/20"
								/>
							</div>
						</div>

						<Separator className="animate-fade-in delay-500" />

						{/* Actions */}
						<div className="flex flex-col gap-3 pb-10 sm:flex-row sm:items-center sm:justify-between animate-fade-in-up delay-600">
							<div className="flex gap-3 order-1 sm:order-2">
								<Link href="/feed">
									<Button variant="ghost" className="btn-press">
										Cancelar
									</Button>
								</Link>
								<Button
									onClick={handlePublish}
									disabled={!isValid || isSubmitting}
									className={cn(
										"gap-2 bg-gold text-[#FFFFFF] font-medium btn-press transition-all duration-300",
										isValid
											? "hover:bg-gold-light hover:shadow-lg hover:shadow-gold/20"
											: "opacity-50"
									)}
								>
									{isSubmitting ? (
										<>
											<Loader2 className="size-4 animate-spin" />
											Publicando...
										</>
									) : (
										<>
											<Upload className="size-4" />
											{isEditing ? "Salvar alterações" : "Publicar"}
										</>
									)}
								</Button>
							</div>
						</div>
					</div>

					{/* Live Preview Sidebar */}
					<aside
						className={cn(
							"w-full lg:w-80 shrink-0 transition-all duration-500",
							showPreview
								? "max-h-[600px] opacity-100 translate-y-0"
								: "max-h-0 opacity-0 -translate-y-4 lg:max-h-[600px] lg:opacity-100 lg:translate-y-0 overflow-hidden"
						)}
					>
						<div className="sticky top-24">
							<h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground animate-fade-in-down">
								<Sparkles className="size-4 text-gold" />
								Preview
							</h3>

							{/* Mini card preview */}
							<div className="overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:shadow-md hover:shadow-gold/5 animate-scale-in">
								{/* Image area */}
								<div className="relative h-36 bg-gradient-to-br from-gold/20 via-coral/15 to-sunset/10 overflow-hidden">
									{coverPreview ? (
										<img
											src={coverPreview}
											alt="Preview"
											className="size-full object-cover"
										/>
									) : (
										<div className="flex size-full items-center justify-center">
											<div className="flex size-10 items-center justify-center rounded-full bg-gold/10">
												<span className="font-serif text-sm font-bold text-gold">
													{title ? title.charAt(0).toUpperCase() : "?"}
												</span>
											</div>
										</div>
									)}
									{category && (
										<Badge
											variant="outline"
											className="absolute top-2 right-2 text-[10px] backdrop-blur-sm bg-card/80"
										>
											{category}
										</Badge>
									)}
								</div>

								<div className="flex flex-col gap-2 p-4">
									<div className="flex items-center gap-2">
										<Avatar className="size-6 border border-border">
											<AvatarFallback className="bg-gold/10 text-gold text-[9px] font-semibold">
												{user?.name
													?.split(" ")
													?.map((n: string) => n[0])
													?.join("") || "?"}
											</AvatarFallback>
										</Avatar>
										<span className="text-xs text-muted-foreground">{user?.name || "..."}</span>
									</div>

									<h4 className="font-serif text-sm font-semibold text-foreground leading-snug line-clamp-2 min-h-[2.5em]">
										{title || "Titulo do projeto..."}
									</h4>
									<p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 min-h-[2.5em]">
										{description || "Descricao do projeto aparece aqui..."}
									</p>

									<div className="flex items-center gap-3 pt-2 border-t border-border/50 text-xs text-muted-foreground">
										<span className="flex items-center gap-1">
											<span className="inline-block size-3 rounded-full border border-current" /> 0
										</span>
										<span className="flex items-center gap-1">
											<span className="inline-block size-3 rounded-full border border-current" /> 0
										</span>
									</div>
								</div>
							</div>

							{/* Tips */}
							<div className="mt-4 rounded-xl border border-border bg-secondary/50 p-4 animate-fade-in-up delay-300">
								<h4 className="text-xs font-semibold text-foreground mb-2">Dicas</h4>
								<ul className="flex flex-col gap-1.5 text-xs text-muted-foreground">
									<li className="flex items-start gap-2">
										<span className="mt-1 size-1 rounded-full bg-gold shrink-0" />
										Use um titulo claro e chamativo
									</li>
									<li className="flex items-start gap-2">
										<span className="mt-1 size-1 rounded-full bg-gold shrink-0" />
										Descreva o processo criativo
									</li>
									<li className="flex items-start gap-2">
										<span className="mt-1 size-1 rounded-full bg-gold shrink-0" />
										Adicione uma imagem de capa atrativa
									</li>
									<li className="flex items-start gap-2">
										<span className="mt-1 size-1 rounded-full bg-gold shrink-0" />
										Inclua o link para o projeto completo
									</li>
								</ul>
							</div>
						</div>
					</aside>
				</div>
			</main>
		</div>
	)
}
