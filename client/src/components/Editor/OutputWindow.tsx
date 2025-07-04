type OutputWindowProps = {
	outputDetails: any;
	language_id: number;
};

const OutputWindow = ({ outputDetails, language_id }: OutputWindowProps) => {
	// Safe base64 decoding function
	const safeAtob = (str: string | null): string => {
		if (!str) return "";
		try {
			// Check if the string is valid base64
			if (str.trim() === "") return "";
			
			// Add padding if needed
			while (str.length % 4) {
				str += '=';
			}
			
			// Check if it's valid base64
			if (!/^[A-Za-z0-9+/]*={0,2}$/.test(str)) {
				return str; // Return original if not valid base64
			}
			
			return atob(str);
		} catch (error) {
			console.warn("Failed to decode base64:", str, error);
			return str; // Return original string if decoding fails
		}
	};

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
					{language_id === 54 && outputDetails.stderr !== null
						? `${safeAtob(outputDetails.stderr)}`
						: null}{" "}
					// C++
					{language_id === 62 && outputDetails.stderr !== null
						? `${safeAtob(outputDetails.stderr)}`
						: null}{" "}
					// Java
					{language_id === 71 && outputDetails.stderr !== null
						? `${safeAtob(outputDetails.stderr)}`
						: null}{" "}
					// Python
					{language_id === 63 && outputDetails.stderr !== null
						? `${safeAtob(outputDetails.stderr)}`
						: null}{" "}
					// JavaScript
					{language_id === 50 && outputDetails.stderr !== null
						? `${safeAtob(outputDetails.stderr)}`
						: null}{" "}
					// C
				</pre>
			);
		}
	};
	return (
		<>
			<div className="max-w-xl min-h-32 rounded-md text-white font-normal text-sm overflow-y-auto">
				{outputDetails && outputDetails.status ? (
					<>{getOutput()}</>
				) : outputDetails && outputDetails.message ? (
					<pre className="px-2 py-1 font-normal text-lg text-red-500">
						{outputDetails.message}
					</pre>
				) : (
					<p className="text-gray-400">Output Window - Compile and run your code to see the output</p>
				)}
			</div>
		</>
	);
};

export default OutputWindow;
