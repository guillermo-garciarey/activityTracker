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

// const options = {
// 	grid: {
// 		padding: {
// 			left: 10,
// 			right: 20,
// 		},
// 	},
// 	chart: {
// 		type: "line",
// 		height: 300,
// 		toolbar: { show: false },
// 		fontFamily: "Inter, sans-serif",
// 		offsetX: 0,
// 		offsetY: 0,
// 	},
// 	zoom: {
// 		enabled: false,
// 	},
// 	series: [
// 		{
// 			name: "Weight Lifted (kg)",
// 			data: [100, 105, 110, 108, 112, 115, 118, 121, 120, 120, 125, 90],
// 		},
// 	],
// 	xaxis: {
// 		categories: [
// 			"Mon",
// 			"Tue",
// 			"Wed",
// 			"Thu",
// 			"Fri",
// 			"Sat",
// 			"Sun",
// 			"Mon",
// 			"Tue",
// 			"Wed",
// 			"Thu",
// 			"Fri",
// 		],
// 		labels: {
// 			style: {
// 				fontSize: "clamp(0.7813rem, 0.7747rem + 0.0326vw, 0.8rem)",
// 				colors: "#666",
// 			},
// 		},
// 	},
// 	yaxis: {
// 		min: 50,
// 		max: 130,
// 		labels: {
// 			show: false,
// 			style: {
// 				fontSize: "clamp(0.7813rem, 0.7747rem + 0.0326vw, 0.8rem)",
// 				colors: "#666",
// 			},
// 		},
// 	},
// 	stroke: {
// 		curve: "smooth",
// 		width: 2,
// 	},
// 	fill: {
// 		type: "solid",
// 	},
// 	colors: ["#c37404"],
// 	markers: {
// 		size: 4,
// 	},
// 	legend: {
// 		show: true,
// 		fontSize: "clamp(0.7813rem, 0.7747rem + 0.0326vw, 0.8rem)",
// 		fontFamily: "Inter, sans-serif",
// 		labels: {
// 			colors: "#444",
// 		},
// 		markers: {
// 			width: 20,
// 			height: 2,
// 			strokeWidth: 0,
// 			fillColors: ["#c37404"],
// 			radius: 0,
// 		},
// 	},
// 	tooltip: {
// 		theme: "dark",
// 	},
// };

// const chart = new ApexCharts(document.querySelector("#chart"), options);
// chart.render();

// Testing Chart

// Fake data for activities & metrics
const activityMetrics = {
	bench: ["Weight", "Repetitionss"],
	sprint: ["Distance", "Time"],
};

const metricData = {
	bench: {
		Weight: [100, 105, 110, 112, 115, 117, 118],
		Reps: [8, 9, 9, 10, 9, 10, 10],
		RIR: [3, 2, 2, 1, 1, 1, 1],
	},
	sprint: {
		Distance: [50, 60, 60, 70, 80, 90, 90],
		Time: [9.2, 8.9, 8.7, 8.5, 8.3, 8.4, 8.2],
	},
};

const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const chart = new ApexCharts(document.querySelector("#chart"), {
	chart: {
		type: "line",
		height: 300,
		// fontFamily: "Inter, sans-serif",
		toolbar: { show: false },
		zoom: {
			enabled: false,
		},
	},
	series: [],
	xaxis: {
		categories: labels,
		labels: {
			style: {
				fontSize: "14px",
				colors: "#aaa",
			},
		},
	},
	yaxis: {
		labels: {
			show: false,
			style: {
				fontSize: "14px",
				colors: "#aaa",
			},
		},
	},
	stroke: {
		curve: "smooth",
		width: 2,
	},
	markers: {
		size: 3,
	},
	fill: {
		type: "solid",
		opacity: 1,
	},
	// colors: ["#c37404"],
	colors: ["hsl(18.2813 57.1429% 43.9216%)"],
	legend: { show: true },
	tooltip: { theme: "dark" },
});

chart.render();

function renderChips(activity) {
	const chipContainer = document.getElementById("metricChips");
	chipContainer.innerHTML = "";

	activityMetrics[activity].forEach((metric) => {
		const chip = document.createElement("div");
		chip.className = "chip";
		chip.textContent = metric;
		chip.onclick = () => {
			document
				.querySelectorAll(".chip")
				.forEach((c) => c.classList.remove("active"));
			chip.classList.add("active");
			updateChart(activity, metric);
		};
		chipContainer.appendChild(chip);
	});

	// Auto-select the first metric
	const first = chipContainer.querySelector(".chip");
	if (first) first.click();
}

function updateChart(activity, metric) {
	chart.updateSeries([
		{
			name: metric,
			data: metricData[activity][metric],
		},
	]);
}

// On dropdown change
document.getElementById("activitySelect").addEventListener("change", (e) => {
	renderChips(e.target.value);
});

// Initial load
renderChips("bench");
