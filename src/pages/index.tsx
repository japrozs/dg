"use client";

import { useEffect, useState } from "react";

const projects = [
	{ image: "/img/IMG_0710.JPEG" },
	{ image: "/img/IMG_1955.JPEG" },
	{ image: "/img/IMG_2143.JPEG" },
	{ image: "/img/IMG_2895.JPEG" },
	{ image: "/img/IMG_3035.JPG" },
	{ image: "/img/IMG_6108.JPG" },
	{ image: "/img/IMG_6107.JPG" },
	{ image: "/img/IMG_6445.JPEG" },
	{ image: "/img/IMG_5411.JPEG" },
	{ image: "/img/IMG_5413.JPEG" },
	{ image: "/img/IMG_5325.JPG" },
	{ image: "/img/IMG_5321.JPG" },
	{ image: "/img/IMG_5332.JPG" },
	{ image: "/img/IMG_4536.JPEG" },
	{ image: "/img/IMG_4873.PNG" },
];

const DEFAULT_IMAGE = "/img/pic-with-bg.png";

const EMAIL = "abc@test.net";
const INSTAGRAM = "https://instagram.com/atomuvrz";

function formatDate(date: Date) {
	return date.toLocaleString("en-US", {
		timeZone: "America/New_York",
		weekday: "long",
		month: "long",
		day: "numeric",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		hour12: true,
	});
}

function rgbToHex(r: number, g: number, b: number) {
	return (
		"#" +
		[r, g, b]
			.map((value) =>
				Math.max(0, Math.min(255, Math.round(value)))
					.toString(16)
					.padStart(2, "0"),
			)
			.join("")
	);
}

function getColorCount(index: number) {
	return 3 + ((index * 7 + 2) % 3);
}

function extractColors(src: string, colorCount: number): Promise<string[]> {
	return new Promise((resolve) => {
		const fallback = Array<string>(colorCount).fill("#e5e5e5");
		const image = new Image();

		image.onload = () => {
			try {
				const canvas = document.createElement("canvas");
				const ctx = canvas.getContext("2d", {
					willReadFrequently: true,
				});

				if (!ctx) {
					resolve(fallback);
					return;
				}

				canvas.width = 100;
				canvas.height = 100;

				ctx.drawImage(image, 0, 0, 100, 100);

				const { data } = ctx.getImageData(0, 0, 100, 100);

				const buckets = new Map<
					string,
					{
						r: number;
						g: number;
						b: number;
						count: number;
					}
				>();

				for (let i = 0; i < data.length; i += 4) {
					if (data[i + 3] < 128) continue;

					const r = data[i];
					const g = data[i + 1];
					const b = data[i + 2];

					const qr = Math.min(255, Math.round(r / 24) * 24);
					const qg = Math.min(255, Math.round(g / 24) * 24);
					const qb = Math.min(255, Math.round(b / 24) * 24);

					const key = `${qr},${qg},${qb}`;
					const bucket = buckets.get(key);

					if (bucket) {
						bucket.r += r;
						bucket.g += g;
						bucket.b += b;
						bucket.count++;
					} else {
						buckets.set(key, {
							r,
							g,
							b,
							count: 1,
						});
					}
				}

				const sorted = [...buckets.values()].sort(
					(a, b) => b.count - a.count,
				);

				const selected: {
					r: number;
					g: number;
					b: number;
				}[] = [];

				for (const bucket of sorted) {
					const color = {
						r: bucket.r / bucket.count,
						g: bucket.g / bucket.count,
						b: bucket.b / bucket.count,
					};

					const distinct = selected.every((existing) => {
						const distance = Math.sqrt(
							(color.r - existing.r) ** 2 +
								(color.g - existing.g) ** 2 +
								(color.b - existing.b) ** 2,
						);

						return distance > 42;
					});

					if (distinct) selected.push(color);
					if (selected.length >= colorCount) break;
				}

				for (const bucket of sorted) {
					if (selected.length >= colorCount) break;

					const color = {
						r: bucket.r / bucket.count,
						g: bucket.g / bucket.count,
						b: bucket.b / bucket.count,
					};

					const exists = selected.some((existing) => {
						const distance = Math.sqrt(
							(color.r - existing.r) ** 2 +
								(color.g - existing.g) ** 2 +
								(color.b - existing.b) ** 2,
						);

						return distance < 1;
					});

					if (!exists) selected.push(color);
				}

				const colors = selected.map((color) =>
					rgbToHex(color.r, color.g, color.b),
				);

				while (colors.length < colorCount) {
					colors.push("#e5e5e5");
				}

				resolve(colors);
			} catch {
				resolve(fallback);
			}
		};

		image.onerror = () => resolve(fallback);
		image.src = src;
	});
}

export default function Home() {
	const [date, setDate] = useState("Monday, November 2, 2026 03:07 PM");

	const [selectedProject, setSelectedProject] = useState<number | null>(null);

	const [palettes, setPalettes] = useState<string[][]>(
		projects.map((_, index) =>
			Array<string>(getColorCount(index)).fill("#e5e5e5"),
		),
	);

	useEffect(() => {
		const updateDate = () => setDate(formatDate(new Date()));

		updateDate();

		const interval = setInterval(updateDate, 1000);

		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		let cancelled = false;

		async function loadPalettes() {
			const results = await Promise.all(
				projects.map((project, index) =>
					extractColors(project.image, getColorCount(index)),
				),
			);

			if (!cancelled) {
				setPalettes(results);
			}
		}

		loadPalettes();

		return () => {
			cancelled = true;
		};
	}, []);

	const currentImage =
		selectedProject !== null
			? projects[selectedProject].image
			: DEFAULT_IMAGE;

	const header = (
		<header className="text-right">
			<button
				type="button"
				onClick={() => setSelectedProject(null)}
				className="mb-1 ml-auto block w-max cursor-pointer bg-red-500 px-1 py-0.5 text-white hover:animate-[blink_0.2s_steps(1,end)_infinite]"
			>
				Domanique Gibson
			</button>
			<div className="leading-tight">{date}</div>
		</header>
	);

	const paletteNavigation = (
		<nav aria-label="Project images">
			<ul className="flex flex-wrap items-center justify-end gap-2 p-0 md:flex-col md:items-end md:gap-2 lg:gap-2.5">
				{projects.map((project, index) => (
					<li key={project.image}>
						<button
							type="button"
							onClick={() => setSelectedProject(index)}
							aria-label={`View image ${index + 1}`}
							aria-pressed={selectedProject === index}
							className={`flex cursor-pointer items-center justify-end gap-1 p-[2px] hover:bg-[#b6ff00] ${
								selectedProject === index ? "bg-[#b6ff00]" : ""
							}`}
						>
							<div className="flex items-center gap-[3px]">
								{palettes[index].map((color, colorIndex) => (
									<span
										key={colorIndex}
										aria-hidden="true"
										className="block h-[15px] w-[15px] shrink-0 sm:h-[18px] sm:w-[18px] md:h-[15px] md:w-[15px] lg:h-[18px] lg:w-[18px]"
										style={{ backgroundColor: color }}
									/>
								))}
							</div>

							<span
								aria-hidden="true"
								className="ml-1 block h-[5px] w-[5px] shrink-0 rounded-full bg-black"
							/>
						</button>
					</li>
				))}
			</ul>
		</nav>
	);

	const flags = (
		<div className="flex shrink-0 items-center justify-end gap-2">
			<img
				src="/img/us-flag.png"
				alt="United States flag"
				className="block h-auto w-14 object-contain sm:w-16 lg:w-20"
			/>
			<img
				src="/img/trinidad-flag.png"
				alt="Trinidad and Tobago flag"
				className="block h-auto w-12 object-contain sm:w-14 lg:w-18"
			/>
		</div>
	);

	return (
		<main className="flex min-h-dvh w-full flex-col gap-5 overflow-x-hidden p-4 text-base leading-none md:grid md:h-dvh md:min-h-0 md:grid-cols-[55%_45%] md:gap-0 md:overflow-hidden md:p-5 lg:grid-cols-[60%_40%] lg:text-lg">
			{/* Mobile header */}
			<div className="order-1 md:hidden">{header}</div>

			{/* Main image */}
			<section className="order-2 flex min-w-0 flex-col items-start md:order-1 md:min-h-0 md:overflow-hidden md:pr-4 md:pt-[22px] lg:pr-5">
				<div className="flex w-full min-w-0 flex-col items-start md:min-h-0 md:flex-1">
					<div className="flex w-full justify-center md:min-h-0 md:justify-start">
						<img
							src={currentImage}
							alt={
								selectedProject !== null
									? `Project ${selectedProject + 1}`
									: "Domanique Gibson"
							}
							className={`block h-auto max-w-full object-contain ${
								selectedProject === null
									? "max-h-[55dvh] md:max-h-[calc(100dvh-240px)]"
									: "max-h-[65dvh] md:max-h-[calc(100dvh-40px)]"
							}`}
						/>
					</div>

					{selectedProject === null && (
						<div className="mt-4 w-full max-w-[580px] text-left leading-[1.35] md:mt-4 md:shrink-0">
							<p className="text-sm sm:text-base">
								Domanique Gibson is a graphic designer from
								Chicago, now based in Atlanta. Her work spans
								visual identities, album artwork, and creative
								collaborations with music artists. Currently
								accepting commissions for new projects.
							</p>

							<div className="mt-3 flex items-center gap-4 text-sm sm:text-base">
								<a
									href={`mailto:${EMAIL}`}
									className="underline underline-offset-2 hover:bg-red-500 hover:text-white"
								>
									Email
								</a>

								<a
									href={INSTAGRAM}
									target="_blank"
									rel="noopener noreferrer"
									className="underline underline-offset-2 hover:bg-red-500 hover:text-white"
								>
									Instagram
								</a>
							</div>
						</div>
					)}
				</div>
			</section>

			{/* Desktop sidebar */}
			<aside className="order-3 hidden min-h-0 min-w-0 flex-col overflow-hidden text-right md:order-2 md:flex md:pl-4 md:pt-[22px] lg:pl-5">
				<div className="min-h-0 overflow-y-auto">
					{header}

					<div className="mt-5 md:mt-[23px]">{paletteNavigation}</div>
				</div>

				<div className="mt-auto shrink-0 pt-6">{flags}</div>
			</aside>

			{/* Mobile palette navigation and flags */}
			<div className="order-3 flex flex-col gap-6 md:hidden">
				{paletteNavigation}

				<div className="pt-2">{flags}</div>
			</div>
		</main>
	);
}
