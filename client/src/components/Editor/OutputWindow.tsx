type OutputWindowProps = {
	outputDetails: any;
	language_id: number;
};

const isBase64 = (str: string | null | undefined) => {
	if (!str || typeof str !== 'string') return false;
	// Remove whitespace and check base64 pattern
	const cleaned = str.replace(/\s/g, '');
	// Must be a multiple of 4 and only contain valid base64 chars
	return cleaned.length % 4 === 0 && /^[A-Za-z0-9+/=]+$/.test(cleaned);
};

const safeAtob = (str: string | null | undefined) => {
	if (!str) return '';
	if (!isBase64(str)) return str; // fallback: show raw string if not base64
	try {
		return atob(str);
	} catch (e) {
		return '[Invalid base64 output]';
	}
};

const OutputWindow = ({ outputDetails, language_id }: OutputWindowProps) => {
	const getOutput = () => {
		let statusId = outputDetails?.status?.id;

		if (statusId === 6) {
			// compilation error
			return (
				<pre className="px-2 py-1 font-normal text-lg text-red-500">
					{language_id === 54 && outputDetails.compile_output !== null
						? `${safeAtob(outputDetails.compile_output)}`
						: null}

					{language_id === 62 && outputDetails.compile_output !== null
						? `${safeAtob(outputDetails.compile_output)}`
						: null}

					{language_id === 71 && outputDetails.compile_output !== null
						? `${safeAtob(outputDetails.compile_output)}`
						: null}
					{language_id === 63 && outputDetails.compile_output !== null
						? `${safeAtob(outputDetails.compile_output)}`
						: null}
					{language_id === 50 && outputDetails.compile_output !== null
						? `${safeAtob(outputDetails.compile_output)}`
						: null}
				</pre>
			);
		} else if (statusId === 3) {
			return (
				<pre className="px-2 py-1 font-normal text-lg text-basecolor">
					{language_id === 54 && outputDetails.stdout !== null
						? `${safeAtob(outputDetails.stdout)}`
						: null}

					{language_id === 62 && outputDetails.stdout !== null
						? `${safeAtob(outputDetails.stdout)}`
						: null}

					{language_id === 71 && outputDetails.stdout !== null
						? `${safeAtob(outputDetails.stdout)}`
						: null}
					{language_id === 63 && outputDetails.stdout !== null
						? `${safeAtob(outputDetails.stdout)}`
						: null}
					{language_id === 50 && outputDetails.stdout !== null
						? `${safeAtob(outputDetails.stdout)}`
						: null}
				</pre>
			);
		} else if (statusId === 4) {
			return (
				<pre className="px-2 py-1 font-normal text-lg text-basecolor">
					{language_id === 54 && outputDetails.stdout !== null
						? `${safeAtob(outputDetails.stdout)}`
						: null}

					{language_id === 62 && outputDetails.stdout !== null
						? `${safeAtob(outputDetails.stdout)}`
						: null}

					{language_id === 71 && outputDetails.stdout !== null
						? `${safeAtob(outputDetails.stdout)}`
						: null}
					{language_id === 63 && outputDetails.stdout !== null
						? `${safeAtob(outputDetails.stdout)}`
						: null}
					{language_id === 50 && outputDetails.stdout !== null
						? `${safeAtob(outputDetails.stdout)}`
						: null}
				</pre>
			);
		} else if (statusId === 5) {
			return (
				<pre className="px-2 py-1 font-normal text-lg text-red-500">
					{`Time Limit Exceeded`}
				</pre>
			);
		} else {
			return (
				<pre className="px-2 py-1 font-normal text-lg text-red-500">
					{outputDetails.stderr !== null
						? safeAtob(outputDetails.stderr)
						: ""}
				</pre>
			);
		}
	};
	return (
		<>
			<div className="max-w-xl min-h-32 rounded-md text-white font-normal text-sm overflow-y-auto">
				{outputDetails ? <>{getOutput()}</> : null}
				{!outputDetails && <p>Output Window</p>}
			</div>
		</>
	);
};

export default OutputWindow;
