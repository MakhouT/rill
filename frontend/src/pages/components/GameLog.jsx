import React, { useState, useEffect } from "react";

const URL = 'ws://127.0.0.1:8080';

const GameLog = () => {
	const [messages, setMessages] = useState([]);
	const [ws, setWs] = useState(new WebSocket(URL));

	useEffect(() => {
		ws.onopen = () => {
			console.log('WebSocket Connected');
		}

		ws.onmessage = (e) => {
			console.log('w.onmessage', e.data);
			const message = e.data;
			setMessages([message, ...messages]);
		}

		return () => {
			ws.onclose = () => {
				console.log('WebSocket Disconnected');
				setWs(new WebSocket(URL));
			}
		}
	}, [ws.onmessage, ws.onopen, ws.onclose, messages]);

	return (
		<div className="bg-white rounded-lg shadow p-10">
        	<h2 className="text-2xl font-extrabold tracking-tight text-gray-900 mb-5">Ongoing tournament log</h2>
			<ul className="divide-y-2 divide-gray-100">
				{messages.reverse().map((message, index) =>
					<li className="p-3" key={index}>
						<em>{message}</em>
					</li>
				)}
			</ul>
		</div>
	)
}

export default GameLog;
