// Service Worker Setup

if ("serviceWorker" in navigator) {
	window.addEventListener("load", () => {
		navigator.serviceWorker
			.register("/service-worker.js")
			.then((reg) => console.log("Service Worker registered:", reg.scope))
			.catch((err) =>
				console.error("Service Worker registration failed:", err)
			);
	});
}

// Toggle Theme (Dark & Light)

const toggleItem = document.getElementById("toggle-theme");
const label = toggleItem.querySelector("small");
const root = document.documentElement;

if (localStorage.getItem("theme") === "dark") {
	root.classList.add("dark");
	label.textContent = "Dark Mode";
} else {
	label.textContent = "Light Mode";
}

toggleItem.addEventListener("click", () => {
	const isDark = root.classList.toggle("dark");
	label.textContent = isDark ? "Dark Mode" : "Light Mode";
	localStorage.setItem("theme", isDark ? "dark" : "light");
});

// Toggle Side Bar
const toggleSidebarBtn = document.getElementById("toggle-sidebar");
const sidebar = document.querySelector(".sidebar");

toggleSidebarBtn.addEventListener("click", () => {
	sidebar.classList.toggle("open-sidebar");
});

// 1. Close sidebar on outside click
document.addEventListener("click", (e) => {
	// If sidebar is open and click is outside both sidebar and toggle button
	if (
		sidebar.classList.contains("open-sidebar") &&
		!sidebar.contains(e.target) &&
		!toggleSidebarBtn.contains(e.target)
	) {
		sidebar.classList.remove("open-sidebar");
	}
});

// 2. Swipe gesture to close (right-to-left swipe)
let touchStartX = 0;
let touchEndX = 0;

sidebar.addEventListener("touchstart", (e) => {
	touchStartX = e.changedTouches[0].screenX;
});

sidebar.addEventListener("touchend", (e) => {
	touchEndX = e.changedTouches[0].screenX;
	handleSwipe();
});

function handleSwipe() {
	const swipeDistance = touchStartX - touchEndX;
	if (swipeDistance < -50) {
		sidebar.classList.remove("open-sidebar");
	}
}

const navLinks = document.querySelectorAll(".sidebar-nav-main a");
const panels = document.querySelectorAll(".panel");

navLinks.forEach((link) => {
	link.addEventListener("click", (e) => {
		e.preventDefault();

		const targetId = link.textContent.trim().replace(/\s+/g, "");
		const targetPanel = document.getElementById(targetId);

		// Deactivate all panels
		panels.forEach((panel) => panel.classList.remove("active"));

		// Activate matching panel
		if (targetPanel) {
			targetPanel.classList.add("active");
		}

		// Close sidebar
		sidebar.classList.remove("open-sidebar");
	});
});

// Top Nav Menu (Visible & Invisible)

const headers = document.querySelectorAll(".header");
const topNavs = document.querySelectorAll(".top-nav");

// Check that both NodeLists are the same length
if (headers.length === topNavs.length) {
	headers.forEach((header, index) => {
		const nav = topNavs[index];

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					nav.classList.add("invisible");
				} else {
					nav.classList.remove("invisible");
				}
			},
			{
				root: null,
				threshold: 0,
			}
		);

		observer.observe(header);
	});
} else {
	console.warn("Mismatched number of .header and .top-nav elements.");
}

// Activity Card Gradient Generator

const gradients = [
	["--gradient-1a", "--gradient-1b"],
	["--gradient-2a", "--gradient-2b"],
	["--gradient-3a", "--gradient-3b"],
	["--gradient-4a", "--gradient-4b"],
	["--gradient-5a", "--gradient-5b"],
];

document.querySelectorAll(".alt-card-image").forEach((el, i) => {
	const [startVar, endVar] = gradients[i % gradients.length];
	el.style.background = `linear-gradient(180deg, var(${startVar}), var(${endVar}))`;
});

document.querySelectorAll(".grid-card-image").forEach((el, i) => {
	const [startVar, endVar] = gradients[i % gradients.length];
	el.style.background = `linear-gradient(180deg, var(${startVar}), var(${endVar}))`;
});

const gradientsblocks = [
	["--gradient-block-1a", "--gradient-block-1b"],
	["--gradient-block-2a", "--gradient-block-2b"],
	["--gradient-block-4a", "--gradient-block-4b"],
	["--gradient-block-5a", "--gradient-block-5b"],
];

document.querySelectorAll(".block-card-image").forEach((el, i) => {
	const [startVar, endVar] = gradientsblocks[i % gradientsblocks.length];
	el.style.background = `linear-gradient(180deg, var(${startVar}), var(${endVar}))`;
});

// Grid Card Overlay

document.addEventListener("click", (e) => {
	if (e.target.classList.contains("fa-ellipsis")) {
		const card = e.target.closest(".grid-card");
		const overlay = card.querySelector(".card-overlay");

		document.querySelectorAll(".card-overlay").forEach((o) => {
			if (o !== overlay) o.classList.remove("show");
		});

		overlay.classList.toggle("show");
		e.stopPropagation();
	} else {
		// Click outside closes all overlays
		document
			.querySelectorAll(".card-overlay")
			.forEach((o) => o.classList.remove("show"));
	}
});

// Chart

const ctx = document.getElementById("myChart").getContext("2d");

// 🟡 FAKE DATA
const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const data = {
	labels: labels,
	datasets: [
		{
			label: "Weight Lifted (kg)",
			data: [100, 105, 110, 108, 112, 115, 118],
			borderColor: "rgba(75, 192, 192, 1)",
			backgroundColor: "rgba(75, 192, 192, 0.2)",
			tension: 0.4, // curve line
			fill: true,
			pointRadius: 4,
			pointHoverRadius: 6,
		},
	],
};

// 🟢 CONFIG
const config = {
	type: "line",
	data: data,
	options: {
		responsive: true,
		plugins: {
			title: {
				display: true,
				text: "Bench Press - Weekly Progress",
			},
		},
		interaction: {
			intersect: false,
			mode: "index",
		},
		scales: {
			x: {
				title: {
					display: true,
					text: "Day",
				},
			},
			y: {
				title: {
					display: true,
					text: "Kilograms",
				},
				suggestedMin: 90,
				suggestedMax: 130,
			},
		},
	},
};

// 🔵 CREATE CHART
new Chart(ctx, config);
