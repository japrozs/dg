
"use client";

import { useState } from "react";

type Artwork = {
	src: string;
	color: string;
};

const artworks: Artwork[] = [
	{ src: "IMG_0710.JPEG", color: "#3A2ECB" },
	{ src: "IMG_1955.JPEG", color: "#5D0FA3" },
	{ src: "IMG_2143.JPEG", color: "#72A2DF" },
	{ src: "IMG_2768.JPEG", color: "#9291B0" },
	{ src: "IMG_2772.JPEG", color: "#390034" },
	{ src: "IMG_2895.JPEG", color: "#223615" },
	{ src: "IMG_2896.JPEG", color: "#472E39" },
	{ src: "IMG_3015.JPG", color: "#E1A0E7" },
	{ src: "IMG_3035.JPG", color: "#25211A" },
	{ src: "IMG_3786.JPG", color: "#05022D" },
	{ src: "IMG_4536.JPEG", color: "#5F605F" },
	{ src: "IMG_4873.PNG", color: "#5C2356" },
	{ src: "IMG_5321.JPG", color: "#EDEDEF" },
	{ src: "IMG_5325.JPG", color: "#A95322" },
	{ src: "IMG_5332.JPG", color: "#266296" },
	{ src: "IMG_5411.JPEG", color: "#2F8F67" },
	{ src: "IMG_5413.JPEG", color: "#019EEA" },
	{ src: "IMG_6107.JPG", color: "#1B2976" },
	{ src: "IMG_6108.JPG", color: "#5E92AE" },
	{ src: "IMG_6445.JPEG", color: "#1F586A" },
];

function getHue(hex: string) {
	const r = parseInt(hex.slice(1, 3), 16) / 255;
	const g = parseInt(hex.slice(3, 5), 16) / 255;
	const b = parseInt(hex.slice(5, 7), 16) / 255;

	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	const delta = max - min;

	if (delta === 0) return 0;

	let hue = 0;

	if (max === r) {
		hue = ((g - b) / delta) % 6;
	} else if (max === g) {
		hue = (b - r) / delta + 2;
	} else {
		hue = (r - g) / delta + 4;
	}

	return (hue * 60 + 360) % 360;
}

const sortedArtworks = [...artworks].sort(
	(a, b) => getHue(a.color) - getHue(b.color),
);

const TOTAL = sortedArtworks.length;

function polarPoint(radius: number, angle: number) {
	const radians = (angle * Math.PI) / 180;

	return {
		x: 200 + Math.cos(radians) * radius,
		y: 200 + Math.sin(radians) * radius,
	};
}

function createSegment(index: number, total: number) {
	const step = 360 / total;
	const start = -90 + index * step;
	const end = start + step;

	const outerStart = polarPoint(173, start);
	const outerEnd = polarPoint(173, end);
	const innerEnd = polarPoint(105, end);
	const innerStart = polarPoint(105, start);

	return [
		`M ${outerStart.x} ${outerStart.y}`,
		`A 173 173 0 0 1 ${outerEnd.x} ${outerEnd.y}`,
		`L ${innerEnd.x} ${innerEnd.y}`,
		`A 105 105 0 0 0 ${innerStart.x} ${innerStart.y}`,
		"Z",
	].join(" ");
}

function RegistrationMark({
	className = "",
}: {
	className?: string;
}) {
	return (
		<span
			aria-hidden="true"
			className={`registration-mark ${className}`}
		>
			<span />
			<span />
		</span>
	);
}

export default function Home() {
	const [activeIndex, setActiveIndex] = useState(0);

	const activeAngle = -90 + (activeIndex + 0.5) * (360 / TOTAL);
	const indicator = polarPoint(190, activeAngle);

	return (
		<main className="archive-page relative min-h-dvh overflow-hidden">
			{/* Fine architectural background */}
			<div
				aria-hidden="true"
				className="archive-background pointer-events-none absolute inset-0"
			/>

			{/* Small marginal information */}
			<div className="archive-topline">
				<span>DG—001 / CHROMATIC STUDIES</span>
				<span>AN INDEX OF SELECTED WORKS</span>
				<span>20 ENTRIES / ONGOING</span>
			</div>

			{/* Main three-part composition */}
			<div className="archive-layout relative mx-auto grid min-h-dvh w-full max-w-[1800px] grid-cols-1 items-center lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)_minmax(0,1fr)]">
				{/* LEFT: COLOR INSTRUMENT */}
				<section
					aria-label="Artwork color selector"
					className="archive-wheel-column order-2 flex min-w-0 flex-col items-center justify-center lg:order-1"
				>
					<div className="archive-section-heading">
						<span>FIG. 01</span>
						<span>CHROMATIC INDEX</span>
					</div>

					<div className="archive-wheel-container">
						<RegistrationMark className="top-0 left-0" />
						<RegistrationMark className="top-0 right-0" />
						<RegistrationMark className="bottom-0 left-0" />
						<RegistrationMark className="bottom-0 right-0" />

						<svg
							viewBox="0 0 400 400"
							className="archive-wheel block h-auto w-full"
							role="group"
							aria-label="Explore artworks by their colors"
						>
							{/* Outer instrument rings */}
							<circle
								cx="200"
								cy="200"
								r="193"
								fill="none"
								stroke="currentColor"
								strokeWidth="0.5"
								className="instrument-guide"
							/>

							<circle
								cx="200"
								cy="200"
								r="185"
								fill="none"
								stroke="currentColor"
								strokeWidth="0.5"
								className="instrument-guide"
							/>

							{/* Radial markings */}
							{Array.from({ length: 80 }, (_, index) => {
								const angle = -90 + index * 4.5;
								const major = index % 4 === 0;

								const start = polarPoint(
									major ? 179 : 184,
									angle,
								);

								const end = polarPoint(190, angle);

								return (
									<line
										key={index}
										x1={start.x}
										y1={start.y}
										x2={end.x}
										y2={end.y}
										stroke="currentColor"
										strokeWidth={major ? 0.8 : 0.45}
										className="instrument-guide"
									/>
								);
							})}

							{/* Actual artwork colors */}
							{sortedArtworks.map((art, index) => {
								const isActive = index === activeIndex;

								return (
									<path
										key={art.src}
										d={createSegment(index, TOTAL)}
										fill={art.color}
										stroke="var(--archive-paper)"
										strokeWidth="1.5"
										className={`archive-wheel-segment ${
											isActive ? "is-active" : ""
										}`}
										onMouseEnter={() =>
											setActiveIndex(index)
										}
										onFocus={() =>
											setActiveIndex(index)
										}
										onClick={() =>
											setActiveIndex(index)
										}
										onKeyDown={(event) => {
											if (
												event.key === "Enter" ||
												event.key === " "
											) {
												event.preventDefault();
												setActiveIndex(index);
											}
										}}
										tabIndex={0}
										role="button"
										aria-label={`Display artwork ${index + 1}`}
										aria-pressed={isActive}
									/>
								);
							})}

							{/* Inner blank face */}
							<circle
								cx="200"
								cy="200"
								r="101"
								fill="var(--archive-paper)"
								className="pointer-events-none"
							/>

							{/* Empty inner registration rings */}
							<circle
								cx="200"
								cy="200"
								r="93"
								fill="none"
								stroke="currentColor"
								strokeWidth="0.5"
								className="instrument-guide pointer-events-none"
							/>

							<circle
								cx="200"
								cy="200"
								r="69"
								fill="none"
								stroke="currentColor"
								strokeWidth="0.5"
								strokeDasharray="1 5"
								className="instrument-guide pointer-events-none"
							/>

							{/* Center crosshairs: no text */}
							<g
								className="instrument-guide pointer-events-none"
								stroke="currentColor"
								strokeWidth="0.6"
							>
								<line x1="189" y1="200" x2="211" y2="200" />
								<line x1="200" y1="189" x2="200" y2="211" />
								<circle
									cx="200"
									cy="200"
									r="2"
									fill="none"
								/>
							</g>

							{/* Precise active-position indicator */}
							<circle
								cx={indicator.x}
								cy={indicator.y}
								r="3.5"
								fill="var(--archive-ink)"
								className="pointer-events-none transition-all duration-300 ease-out"
							/>

							<circle
								cx={indicator.x}
								cy={indicator.y}
								r="7"
								fill="none"
								stroke="var(--archive-ink)"
								strokeWidth="0.65"
								className="pointer-events-none transition-all duration-300 ease-out"
							/>
						</svg>
					</div>

					<div className="archive-wheel-footer">
						<span>hover to explore</span>
						<span className="archive-wheel-coordinate">
							{String(activeIndex + 1).padStart(2, "0")} / 20
						</span>
					</div>

					<p className="archive-side-note">
						A visual taxonomy organized by color.
						<br />
						Each fragment corresponds to a work.
					</p>
				</section>

				{/* CENTER: ORIGINAL HOMEPAGE */}
				<section className="archive-center-column order-1 flex min-w-0 items-center justify-center lg:order-2">
					<div className="archive-identity relative flex w-full max-w-xl translate-y-10 flex-col items-center text-center">
						{/* Original logo */}
						<img
							src="/img/dominique-gibson-logo.png"
							alt="Dominique Gibson"
							className="mb-6 block h-auto w-full max-w-sm object-contain max-sm:max-w-xs"
						/>

						{/* Original byline */}
						<p className="text-center leading-tight italic">
							Bronté Tolentino (b.1998), Graphic Designer based in
							<br className="max-sm:hidden" /> Toronto — Currently
							available for freelance work
						</p>

						{/* Original symbol */}
						<span
							aria-hidden="true"
							className="mt-3 text-sm not-italic text-neutral-400"
						>
							⊕
						</span>

						{/* Original links */}
						<nav
							aria-label="Main navigation"
							className="mt-2 flex w-full max-w-sm items-center justify-between gap-6 font-mono text-[0.9em] not-italic"
						>
							<a
								href="mailto:hello@example.com"
								className="link-blue"
							>
								email
							</a>

							<a href="/work" className="link-blue">
								work
							</a>

							<a
								href="https://instagram.com"
								target="_blank"
								rel="noopener noreferrer"
								className="link-blue"
							>
								insta
							</a>
						</nav>
					</div>
				</section>

				{/* RIGHT: ARTWORK SPECIMEN */}
				<section
					aria-label="Selected artwork"
					className="archive-art-column order-3 flex min-w-0 flex-col items-center justify-center"
				>
					<div className="archive-section-heading">
						<span>FIG. 02</span>
						<span>SELECTED SPECIMEN</span>
					</div>

					<div className="archive-image-frame">
						<RegistrationMark className="top-0 left-0" />
						<RegistrationMark className="top-0 right-0" />
						<RegistrationMark className="bottom-0 left-0" />
						<RegistrationMark className="bottom-0 right-0" />

						{/* Structural axes */}
						<div
							aria-hidden="true"
							className="archive-axis archive-axis-horizontal"
						/>
						<div
							aria-hidden="true"
							className="archive-axis archive-axis-vertical"
						/>

						{sortedArtworks.map((art, index) => {
							const isActive = activeIndex === index;

							return (
								<div
									key={art.src}
									aria-hidden={!isActive}
									className={`archive-artwork ${
										isActive ? "is-visible" : ""
									}`}
								>
									{/* Faint offset impression */}
									<img
										src={`/img/${art.src}`}
										alt=""
										aria-hidden="true"
										draggable={false}
										className="archive-artwork-echo"
									/>

									{/* Main artwork */}
									<img
										src={`/img/${art.src}`}
										alt={
											isActive
												? `Dominique Gibson artwork ${index + 1}`
												: ""
										}
										draggable={false}
										className="archive-artwork-image"
									/>
								</div>
							);
						})}
					</div>

					<div className="archive-image-footer">
						<span>SELECTED WORK / {String(activeIndex + 1).padStart(2, "0")}</span>
						<span>PLATE {String(activeIndex + 1).padStart(2, "0")}—XX</span>
					</div>

					<p className="archive-side-note">
						An image is never only an image.
						<br />
						A color is never only a color.
					</p>
				</section>
			</div>

			{/* Peripheral exhibition notes */}
			<div className="archive-bottomline">
				<span>DOMINIQUE GIBSON — DIGITAL ARCHIVE</span>
				<span>COLOR / MEMORY / IMAGE</span>
				<span>EST. 2026</span>
			</div>
		</main>
	);
}
