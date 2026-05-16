const SERVICE_WORKER_VERSION = "v1";

const SUPABASE_REALTIME_TOPICS = {
	pedidos: "pedidos",
	cadetes: "cadetes",
	estados: "estados"
};

const runtimeState = {
	realtimeChannels: new Map(),
	pendingNotifications: []
};

self.addEventListener("install", (event) => {
	event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
	event.waitUntil(self.clients.claim());
});

self.addEventListener("message", (event) => {
	const message = event.data ?? {};

	switch (message.type) {
		case "SUPABASE_REALTIME_SUBSCRIBE":
			event.waitUntil(registerRealtimeTopic(message.topic, message.payload));
			break;
		case "SUPABASE_REALTIME_UNSUBSCRIBE":
			event.waitUntil(unregisterRealtimeTopic(message.topic));
			break;
		case "NOTIFICATION_PREVIEW":
			event.waitUntil(queueNotification(message.payload));
			break;
		default:
			break;
	}
});

self.addEventListener("push", (event) => {
	event.waitUntil(handlePushEvent(event));
});

self.addEventListener("notificationclick", (event) => {
	event.notification.close();
	event.waitUntil(handleNotificationClick(event));
});

self.addEventListener("pushsubscriptionchange", (event) => {
	event.waitUntil(handlePushSubscriptionChange(event));
});

async function registerRealtimeTopic(topic, payload = {}) {
	if (!topic) {
		return;
	}

	runtimeState.realtimeChannels.set(topic, {
		topic,
		payload,
		status: "planned"
	});
}

async function unregisterRealtimeTopic(topic) {
	if (!topic) {
		return;
	}

	runtimeState.realtimeChannels.delete(topic);
}

async function queueNotification(payload = {}) {
	runtimeState.pendingNotifications.push({
		payload,
		createdAt: Date.now()
	});
}

async function handlePushEvent(event) {
	const payload = await readPushPayload(event);

	// Estructura preparada para que luego puedas traducir eventos realtime o push
	// en notificaciones nativas sin tocar el resto del service worker.
	await showNotification(payload);
}

async function handleNotificationClick(event) {
	const notificationData = event.notification?.data ?? {};
	const targetUrl = notificationData.url || "/index.html";

	const clientsList = await self.clients.matchAll({
		type: "window",
		includeUncontrolled: true
	});

	for (const client of clientsList) {
		if (client.url === targetUrl && "focus" in client) {
			await client.focus();
			return;
		}
	}

	if (self.clients.openWindow) {
		await self.clients.openWindow(targetUrl);
	}
}

async function handlePushSubscriptionChange(event) {
	// Punto de extensión para renovar la suscripción cuando lo implementes.
	// Aquí luego podrás reenviar el nuevo endpoint a tu backend.
	void event;
}

async function readPushPayload(event) {
	if (!event.data) {
		return {};
	}

	try {
		return event.data.json();
	} catch {
		return {
			title: event.data.text()
		};
	}
}

async function showNotification(payload = {}) {
	const title = payload.title || "Nueva actualización";
	const options = {
		body: payload.body || "Hay cambios pendientes por revisar.",
		data: {
			url: payload.url || "/index.html",
			topic: payload.topic || null,
			source: payload.source || "service-worker"
		}
	};

	await self.registration.showNotification(title, options);
}

