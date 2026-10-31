"use client";

import { useEffect, useState } from "react";

const navigation = [
	{ label: "Contact", href: "mailto:hello@example.com" },
	{ label: "Work", href: "#work" },
	{ label: "About", href: "#about" },
];

const projects = [
	{
		id: "project-01",
		title: "Desert Outpost",
		year: "2026",
		type: "Environment Design, Illustration",
		images: ["/img/IMG_6108.JPG", "/img/IMG_6107.JPG"],
	},
	{
		id: "project-02",
		title: "Phantom",
		year: "2025",
		type: "Character Design, Digital Painting",
		images: [
			"/img/IMG_6445.JPEG",
			"/img/IMG_5411.JPEG",
			"/img/IMG_5413.JPEG",
		],
	},
	{
		id: "project-03",
		title: "Passing Seasons",
		year: "2025",
		type: "Environment Design, Color Studies",
		images: ["/img/IMG_5325.JPG", "/img/IMG_5321.JPG", "/img/IMG_5332.JPG"],
	},
	{
		id: "project-04",
		title: "Character Studies",
		year: "2024",
		type: "Illustration, Character Design",
		images: [
			"/img/IMG_4536.JPEG",
			"/img/IMG_4873.PNG",
			"/img/IMG_3015.JPG",
			"/img/IMG_3786.JPG",
			"/img/IMG_3035.JPG",
		],
	},
	{
		id: "project-05",
		title: "Otherworlds",
		year: "2024",
		type: "Concept Art, Digital Illustration",
		images: ["/img/IMG_2768.JPEG", "/img/IMG_2772.JPEG"],
	},
	{
		id: "project-06",
		title: "Luminous Figures",
		year: "2023",
		type: "Portraiture, Digital Painting",
		images: [
			"/img/IMG_2895.JPEG",
			"/img/IMG_2896.JPEG",
			"/img/IMG_2143.JPEG",
			"/img/IMG_1955.JPEG",
			"/img/IMG_0710.JPEG",
		],
	},
];

function useClocks() {
	const [now, setNow] = useState<Date | null>(null);

	useEffect(() => {
		const update = () => setNow(new Date());
		update();

		const interval = window.setInterval(update, 1000);
		return () => window.clearInterval(interval);
	}, []);

	const format = (timeZone: string) =>
		now
			? new Intl.DateTimeFormat("en-US", {
					timeZone,
					hour: "numeric",
					minute: "2-digit",
					hour12: true,
				}).format(now)
			: "--:--";

	return {
		atlanta: format("America/New_York"),
		trinidad: format("America/Port_of_Spain"),
	};
}

export default function Home() {
	const { atlanta, trinidad } = useClocks();

	return (
		<main className="relative isolate h-dvh w-full overflow-hidden bg-white text-[#111]">
			{/* Layer 1: Background dashed lines */}
			<div
				className="pointer-events-none fixed inset-0 z-0"
				aria-hidden="true"
			>
				{/* Vertical lines */}
				<div className="absolute inset-y-0 left-6 border-l border-dashed border-neutral-200 max-md:left-4" />
				<div className="absolute inset-y-0 right-6 border-l border-dashed border-neutral-200" />

				{/* Horizontal lines */}
				<div className="absolute inset-x-0 top-4 border-t border-dashed border-neutral-200" />
				<div className="absolute inset-x-0 bottom-28 border-t border-dashed border-neutral-200" />
				<div className="absolute inset-x-0 bottom-8 border-t border-dashed border-neutral-200" />
			</div>

			{/* Layer 2: Scrollable projects */}
			<section
				id="work"
				aria-label="Selected work"
				className="absolute inset-0 z-10 overflow-x-hidden overflow-y-auto overscroll-contain not-italic"
			>
				<div className="mx-auto flex w-full max-w-4xl flex-col gap-32 px-12 pt-32 pb-64 max-md:gap-20 max-md:px-10 max-md:pt-24 max-sm:pb-80">
					{projects.map((project, index) => (
						<article
							key={project.id}
							id={project.id}
							className="flex w-full flex-col gap-4"
						>
							{/* Project information */}
							<div className="flex items-start justify-between gap-4">
								<div>
									<h2>+ {project.title}</h2>
									<p>{project.type}</p>
								</div>

								<span className="shrink-0">{project.year}</span>
							</div>

							{/* Project images */}
							<div className="flex flex-col gap-3">
								{project.images.map((src, imageIndex) => (
									<div
										key={src}
										className="relative w-full overflow-hidden bg-neutral-100"
									>
										<img
											src={src}
											alt={`${project.title} — Image ${imageIndex + 1}`}
											loading={
												index === 0 && imageIndex === 0
													? "eager"
													: "lazy"
											}
											className="block h-auto w-full"
										/>
									</div>
								))}
							</div>
						</article>
					))}
				</div>
			</section>

			{/* Layer 3: Fixed interface */}
			<div className="pointer-events-none fixed inset-0 z-30">
				{/* Artist name */}
				<header className="pointer-events-auto absolute top-1 right-12 max-md:right-10">
					<span className="whitespace-nowrap">Dominique Gibson</span>
				</header>

				{/* Right navigation */}
				<nav
					aria-label="Main navigation"
					className="pointer-events-auto absolute top-16 right-6 flex translate-x-1/2 flex-col items-center gap-20 max-md:gap-12"
				>
					{navigation.map(({ label, href }) => (
						<a
							key={label}
							href={href}
							className="link-blue block rotate-180 whitespace-nowrap [writing-mode:vertical-rl]"
						>
							{label}
						</a>
					))}
				</nav>

				{/* Logo */}
				<div
					id="about"
					className="absolute bottom-48 left-6 w-96 max-w-[65vw] max-md:bottom-52 max-md:left-4 max-md:w-64 max-sm:bottom-64 max-sm:w-48"
				>
					<img
						src="/img/dominique-gibson-logo.png"
						alt="Dominique Gibson"
						className="block h-auto w-full"
					/>
				</div>

				{/* Artist information: desktop */}
				<div className="absolute right-6 bottom-16 left-6 hidden min-h-20 items-center justify-between gap-8 md:flex">
					<p>
						Bronté Tolentino (b.1998), Graphic Designer based in
						<br />
						Toronto — Currently available for freelance work
					</p>

					<div className="shrink-0 whitespace-nowrap">
						Atlanta — {atlanta}
					</div>
				</div>

				{/* Artist information and footer: mobile */}
				<div className="absolute inset-x-0 bottom-0 bg-white px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:hidden">
					<div className="mb-4 flex flex-col gap-2">
						<p>
							Bronté Tolentino (b.1998), Graphic Designer based in
							Toronto — Currently available for freelance work
						</p>

						<span>Atlanta — {atlanta}</span>
					</div>

					<footer className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
						<div className="pointer-events-auto flex flex-wrap items-center gap-x-4 gap-y-2">
							<a
								href="mailto:hello@example.com"
								className="link-blue"
							>
								Email
							</a>

							<a
								href="https://linkedin.com"
								target="_blank"
								rel="noopener noreferrer"
								className="link-blue"
							>
								LinkedIn
							</a>

							<a
								href="https://instagram.com"
								target="_blank"
								rel="noopener noreferrer"
								className="link-blue"
							>
								Instagram
							</a>
						</div>

						<span className="whitespace-nowrap">
							Trinidad — {trinidad}
						</span>
					</footer>
				</div>

				{/* Footer: desktop */}
				<footer className="absolute right-6 bottom-0 left-6 hidden min-h-16 items-center justify-between gap-4 md:flex">
					<div className="pointer-events-auto flex items-center gap-10">
						<a
							href="mailto:hello@example.com"
							className="link-blue"
						>
							Email
						</a>

						<a
							href="https://linkedin.com"
							target="_blank"
							rel="noopener noreferrer"
							className="link-blue"
						>
							LinkedIn
						</a>

						<a
							href="https://instagram.com"
							target="_blank"
							rel="noopener noreferrer"
							className="link-blue"
						>
							Instagram
						</a>
					</div>

					<div className="whitespace-nowrap">
						Trinidad — {trinidad}
					</div>
				</footer>
			</div>
		</main>
	);
}
