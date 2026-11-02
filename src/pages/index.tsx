"use client";

import { useEffect, useState } from "react";

const DESIGN_WIDTH = 1649;
const DESIGN_HEIGHT = 928;

type Slot = {
	x: number;
	y: number;
	w: number;
	h: number;
};

const artworks = [
	"/img/IMG_6108.JPG",
	"/img/IMG_5411.JPEG",
	"/img/IMG_3035.JPG",
	"/img/IMG_2896.JPEG",
	"/img/IMG_3786.JPG",
	"/img/IMG_4873.PNG",
	"/img/IMG_1955.JPEG",
	"/img/IMG_0710.JPEG",
	"/img/IMG_2768.JPEG",
	"/img/IMG_3015.JPG",
	"/img/IMG_6107.JPG",
	"/img/IMG_6445.JPEG",
	"/img/IMG_4536.JPEG",
	"/img/IMG_5321.JPG",
	"/img/IMG_5325.JPG",
	"/img/IMG_5332.JPG",
	"/img/IMG_2143.JPEG",
	"/img/IMG_5413.JPEG",
	"/img/IMG_2895.JPEG",
	"/img/IMG_2772.JPEG",
	"/img/IMG_5321.JPG",
	"/img/IMG_5411.JPEG",
	"/img/IMG_6108.JPG",
	"/img/IMG_3786.JPG",
	"/img/IMG_1955.JPEG",
	"/img/IMG_3015.JPG",
];

function makeSlot(x1: number, y1: number, x2: number, y2: number): Slot {
	return {
		x: (x1 / DESIGN_WIDTH) * 100,
		y: (y1 / DESIGN_HEIGHT) * 100,
		w: ((x2 - x1) / DESIGN_WIDTH) * 100,
		h: ((y2 - y1) / DESIGN_HEIGHT) * 100,
	};
}

/*
 * Fixed artwork layout.
 * Every cell beneath the header contains an image.
 * Coordinates follow the original 1649 × 928 grid.
 */
const imageSlots: Slot[] = [
	// Row 2
	makeSlot(32, 183, 429, 305),
	makeSlot(429, 183, 825, 305),
	makeSlot(825, 183, 1221, 305),
	makeSlot(1221, 183, 1619, 305),

	// Row 3
	makeSlot(32, 305, 429, 412),
	makeSlot(429, 305, 613, 412),
	makeSlot(613, 305, 825, 412),
	makeSlot(825, 305, 1221, 412),
	makeSlot(1221, 305, 1619, 412),

	// Row 4
	makeSlot(32, 412, 429, 526),
	makeSlot(429, 412, 613, 526),
	makeSlot(613, 412, 825, 526),
	makeSlot(825, 412, 1023, 526),
	makeSlot(1023, 412, 1221, 526),
	makeSlot(1221, 412, 1619, 526),

	// Row 5
	makeSlot(32, 526, 429, 650),
	makeSlot(429, 526, 613, 650),
	makeSlot(613, 526, 825, 650),
	makeSlot(825, 526, 1023, 650),
	makeSlot(1023, 526, 1221, 650),
	makeSlot(1221, 526, 1619, 650),

	// Row 6
	makeSlot(32, 650, 429, 900),
	makeSlot(429, 650, 613, 900),
	makeSlot(613, 650, 825, 900),
	makeSlot(825, 650, 1221, 900),
	makeSlot(1221, 650, 1619, 900),
];

function AtlantaClock() {
	const [time, setTime] = useState("");

	useEffect(() => {
		const update = () => {
			setTime(
				new Intl.DateTimeFormat("en-US", {
					timeZone: "America/New_York",
					hour: "numeric",
					minute: "2-digit",
					hour12: true,
				}).format(new Date()),
			);
		};

		update();

		const interval = window.setInterval(update, 30000);

		return () => window.clearInterval(interval);
	}, []);

	return <span>Atlanta — {time}</span>;
}

function GridLines() {
	return (
		<svg
			className="pointer-events-none absolute inset-0 z-20 h-full w-full"
			viewBox="0 0 1649 928"
			preserveAspectRatio="none"
			aria-hidden="true"
		>
			<g fill="none" stroke="#63efff" strokeWidth="1">
				{/* Horizontal lines */}
				<path d="M0 26 H1649" />
				<path d="M0 183 H1649" />
				<path d="M0 305 H1649" />
				<path d="M0 412 H1649" />
				<path d="M825 526 H1649" />
				<path d="M16 650 H1649" />
				<path d="M0 900 H1649" />

				{/* Vertical lines */}
				<path d="M32 0 V928" />
				<path d="M429 0 V928" />
				<path d="M825 0 V928" />
				<path d="M1221 0 V928" />
				<path d="M1619 0 V928" />

				{/* Smaller subdivisions */}
				<path d="M613 305 V928" />
				<path d="M1023 412 V650" />
			</g>
		</svg>
	);
}

export default function Home() {
	return (
		<main className="fixed inset-0 overflow-hidden bg-white text-black">
			{/* Static artwork grid */}
			<section
				id="work"
				aria-label="Selected artwork"
				className="absolute inset-0 z-0"
			>
				{imageSlots.map((slot, index) => (
					<div
						key={index}
						className="absolute overflow-hidden"
						style={{
							left: `${slot.x}%`,
							top: `${slot.y}%`,
							width: `${slot.w}%`,
							height: `${slot.h}%`,
						}}
					>
						<img
							src={artworks[index]}
							alt={`Selected artwork ${index + 1}`}
							draggable={false}
							className="block h-full w-full scale-[1.4] select-none object-cover"
						/>
					</div>
				))}
			</section>

			{/* Header */}
			<header className="pointer-events-none absolute inset-0 z-10">
				{/* Logo */}
				<div className="absolute left-[1.94%] top-[2.8%] h-[16.92%] w-[24.08%] overflow-hidden">
					<img
						src="/img/dominique-gibson-logo.png"
						alt="Dominique Gibson"
						draggable={false}
						className="block h-full w-full object-contain object-left-top"
					/>
				</div>

				{/* Byline */}
				<div className="absolute left-[26.02%] top-[2.8%] w-[24.01%] overflow-hidden">
					<p className="m-0 font-serif text-[clamp(9px,1.22vw,21px)] leading-[1.12] italic">
						Bronté Tolentino (b.1998), Graphic Designer based in
						Toronto — Currently available for freelance work
					</p>
				</div>

				{/* Navigation */}
				<nav
					aria-label="Main navigation"
					className="pointer-events-auto absolute left-[50.03%] top-[2.8%] flex h-[16.92%] w-[24.02%] flex-col items-end justify-between overflow-hidden font-mono text-[clamp(10px,1.15vw,19px)]"
				>
					<a
						href="mailto:hello@example.com"
						className="text-[#0086e9] hover:bg-[#0086e9] hover:text-white"
					>
						email
					</a>

					<a
						href="#work"
						className="text-[#0086e9] hover:bg-[#0086e9] hover:text-white"
					>
						work
					</a>

					<a
						href="https://instagram.com"
						target="_blank"
						rel="noopener noreferrer"
						className="text-[#0086e9] hover:bg-[#0086e9] hover:text-white"
					>
						insta
					</a>
				</nav>

				{/* Atlanta clock */}
				<div className="absolute right-[1.82%] top-[0.7%] whitespace-nowrap font-serif text-[clamp(10px,1.2vw,21px)] leading-none italic">
					<AtlantaClock />
				</div>
			</header>

			{/* Original cyan grid */}
			<GridLines />
		</main>
	);
}
