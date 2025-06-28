import { useEffect, useState, useRef } from "react";
import CodeEditorWindow from "../Editor/CodeEditorWindow";
import { languageOptions } from "../../constants/languageOptions";
import { themeOptions } from "../../constants/themeOptions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { codeExecutionService } from "../../api/codeExecutionService";
import { defineTheme } from "../../lib/defineThemes";
import OutputWindow from "../Editor/OutputWindow";
import CustomInput from "../Editor/CustomInput";
import OutputDetails from "../Editor/OutputDetails";
import LanguagesDropdown from "../Editor/LanguageDropdown";
import ThemeDropdown from "../Editor/ThemeDropdown";
import { LanguageOption } from "../../constants/languageOptions";
import { themeOption } from "../../constants/themeOptions";
import { Submission } from "../../types/submissions";
import SubmissionDetails from "../Submission/SubmissionDetails";
import { testcaseVerdict } from "../../types/submissions";
import { useParams } from "react-router-dom";

type CodeEditorProps = {
	problemId: number;
	problemDifficulty: string;
	problemCppTemplate: string;
	problemCppDriverCode?: string;
	problemJavaTemplate: string;
	problemJavaDriverCode?: string;
	problemPythonTemplate: string;
	problemPythonDriverCode?: string;
	problemSampleInput: string;
};

const CodeEditor = ({
	problemId,
	problemDifficulty,
	problemCppTemplate,
	problemCppDriverCode,
	problemJavaTemplate,
	problemJavaDriverCode,
	problemPythonTemplate,
	problemPythonDriverCode,
	problemSampleInput,
}: CodeEditorProps) => {
	const [code, setCode] = useState(problemCppTemplate);
	const [customInput, setCustomInput] = useState(problemSampleInput);
	const [outputDetails, setOutputDetails] = useState(null);
	const [runProcessing, setRunProcessing] = useState(false);
	const [submitProcessing, setSubmitProcessing] = useState(false);
	const [theme, setTheme] = useState<themeOption>(themeOptions[0]);
	const [language, setLanguage] = useState<LanguageOption>(languageOptions[0]);
	const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
	const [tab, setTab] = useState<"Editor" | "Input" | "Output">("Editor");
	const [submissionDetails, setSubmissionDetails] = useState<Submission | null>(
		null,
	);

	// const [timerCount, setTimerCount] = useState<number>(1);
	const templates = {
		cpp: problemCppTemplate,
		java: problemJavaTemplate,
		python: problemPythonTemplate,
	};

	const assignmentId = useParams().assignmentId;
	const contestId = useParams().contestId;

	// Add debugging for contestId
	console.log("CodeEditor - contestId from useParams:", contestId);
	console.log("CodeEditor - assignmentId from useParams:", assignmentId);
	console.log("CodeEditor - problemId:", problemId);

	const handleLanguageChange = (sl: LanguageOption | null) => {
		if (!sl) return;
		setLanguage(sl);

		// Update the template based on the selected language
		let selectedTemplate = "";
		switch (sl.value) {
			case "cpp":
				selectedTemplate = templates.cpp;
				break;
			case "java":
				selectedTemplate = templates.java;
				break;
			case "python":
				selectedTemplate = templates.python;
				break;
			default:
				selectedTemplate = "";
		}
		handleEditorChange(selectedTemplate);
	};

	const onChange = (action: string, data: string) => {
		if (action === "code") {
			setCode(data);
		} else {
			console.warn("case not handled!", action, data);
		}
	};

	const handleCompile = async () => {
		setRunProcessing(true);
		let finalCode = code;
		if (language.value === "python") {
			finalCode = code + problemPythonDriverCode;
		} else if (language.value === "java") {
			finalCode = problemJavaDriverCode + code;
		} else {
			finalCode = problemCppDriverCode + code;
		}
		const res = await codeExecutionService.executeCode(
			finalCode,
			language.id,
			customInput,
			language.value,
		);
		console.log("res...", res);
		
		// Check if the API call failed
		if (res.ok === false || !res.token) {
			setRunProcessing(false);
			showErrorToast(res.message || "Failed to execute code. Please check your API configuration.");
			return;
		}
		
		const token = res.token;
		const output = await checkStatus(token);
		if (!output) return;
		setTab("Output");
	};

	const [timerCount, setTimerCount] = useState<number>(1);
	const timerCountRef = useRef(timerCount);

	const delay = (ms: number) =>
		new Promise((resolve) => setTimeout(resolve, ms));

	const checkStatus = async (token: string, isSubmission: boolean = false, retryCount: number = 0) => {
		console.log(`checkStatus called with token: ${token}, isSubmission: ${isSubmission}, retryCount: ${retryCount}`);
		
		// Add timeout for submissions to prevent infinite loops
		if (isSubmission && retryCount > 30) { // 30 seconds timeout
			console.warn(`Timeout reached for token ${token}`);
			return {
				status: "Time Limit Exceeded",
				time: 0,
				memory: 0,
			};
		}
		
		// Call the service to check the status
		console.log(`Calling codeExecutionService.checkStatus for token: ${token}`);
		const res = await codeExecutionService.checkStatus(token);
		console.log(`checkStatus API response:`, res);
		
		// Check if the API call failed
		if (res.ok === false) {
			console.error(`API call failed for token ${token}:`, res.message);
			if (!isSubmission) {
				setRunProcessing(false);
				showErrorToast(res.message || "Failed to check code execution status.");
			}
			throw new Error(res.message || "Failed to check code execution status.");
		}
		
		if (res.errors) {
			console.error(`API errors for token ${token}:`, res.errors);
			if (!isSubmission) {
				setRunProcessing(false);
				showErrorToast(res.errors || res.message || "Something went wrong!");
			}
			throw new Error(res.errors || res.message || "Something went wrong!");
		}

		const statusId = res.status?.id;
		console.log("statusId...", statusId);
		console.log("Full status response:", res);

		if (statusId === 1 || statusId === 2) {
			// Still processing
			if (!isSubmission) {
				setTimerCount((prev) => {
					const newCount = prev + 1;
					timerCountRef.current = newCount; // Update the ref with the new value
					return newCount;
				});

				console.log(
					`Waited for ${timerCountRef.current} seconds, now calling checkStatus again...`,
				);
				await delay(timerCountRef.current * 1000); // Use the ref value for delay
				await checkStatus(token, isSubmission); // Call checkStatus recursively
				return;
			} else {
				// For submissions, wait a bit and try again
				console.log(`Submission still processing, waiting 1 second... (attempt ${retryCount + 1})`);
				await delay(1000);
				return await checkStatus(token, isSubmission, retryCount + 1);
			}
		} else {
			if (!isSubmission) {
				setTimerCount(1); // Reset timerCount when done
				timerCountRef.current = 1; // Also reset the ref value
			}

			if (isSubmission) {
				// Map Judge0 status to our status format
				let statusDescription = res.status?.description || "Unknown";
				
				// Map Judge0 status codes to our format
				if (statusId === 3) {
					statusDescription = "Accepted";
				} else if (statusId === 4) {
					statusDescription = "Wrong Answer";
				} else if (statusId === 5) {
					statusDescription = "Time Limit Exceeded";
				} else if (statusId === 6) {
					statusDescription = "Compilation Error";
				} else if (statusId === 7) {
					statusDescription = "Runtime Error";
				} else if (statusId === 8) {
					statusDescription = "Memory Limit Exceeded";
				}
				
				const TestCaseVerdict: testcaseVerdict = {
					status: statusDescription,
					time: res.time || 0,
					memory: res.memory || 0,
				};
				console.log("TestCaseVerdict...", TestCaseVerdict);
				return TestCaseVerdict;
			} else {
				setRunProcessing(false);
				setOutputDetails(res);
				showSuccessToast("Compiled Successfully!");
				setTab("Output");
				console.log("response.data", res);
				return;
			}
		}
	};

	const handleSubmit = async () => {
		setSubmitProcessing(true);
		let finalCode = code;
		if (language.value === "python") {
			finalCode = code + problemPythonDriverCode;
		} else if (language.value === "java") {
			finalCode = problemJavaDriverCode + code;
		} else {
			finalCode = problemCppDriverCode + code;
		}
		console.log("submitting code...", code);
		console.log("handleSubmit - contestId:", contestId);
		console.log("handleSubmit - assignmentId:", assignmentId);
		console.log("handleSubmit - problemId:", problemId);
		console.log("handleSubmit - problemDifficulty:", problemDifficulty);
		
		// Get user data from localStorage for debugging
		const userData = localStorage.getItem("userData");
		if (userData) {
			const user = JSON.parse(userData);
			console.log("handleSubmit - user data:", user);
			console.log("handleSubmit - user roll number:", user.userRollNumber);
		}
		
		try {
			const res = await codeExecutionService.submitCode(
				finalCode,
				language.id,
				problemId,
			);
			console.log("submit response:", res);
			console.log("submit response type:", typeof res);
			console.log("submit response keys:", Object.keys(res));
			
			if (!res || !res.data) {
				console.error("Invalid response structure:", res);
				setSubmitProcessing(false);
				showErrorToast(res?.message || "Failed to submit code. Please try again.");
				return;
			}
			
			// Handle the response structure
			let tokens: string[];
			if (res.data && Array.isArray(res.data)) {
				// Direct array structure (new format)
				tokens = res.data;
			} else if (res.data && res.data.data && Array.isArray(res.data.data)) {
				// Nested structure (current format)
				tokens = res.data.data;
			} else if (res.data && res.data.data && res.data.data.data && Array.isArray(res.data.data.data)) {
				// Double-nested structure (fallback)
				tokens = res.data.data.data;
			} else {
				console.error("Unexpected response structure:", res.data);
				console.error("Response data type:", typeof res.data);
				console.error("Response data keys:", res.data ? Object.keys(res.data) : "null");
				if (res.data && res.data.data) {
					console.error("Nested data keys:", Object.keys(res.data.data));
				}
				setSubmitProcessing(false);
				showErrorToast("Unexpected response format from server.");
				return;
			}
			
			console.log("tokens received:", tokens);
			console.log("tokens type:", typeof tokens);
			console.log("tokens length:", tokens.length);
			console.log("tokens is array:", Array.isArray(tokens));
			
			if (!tokens || tokens.length === 0) {
				console.error("No tokens received");
				setSubmitProcessing(false);
				showErrorToast("No test cases found for this problem.");
				return;
			}
			
			const testcasesVerdict: Array<testcaseVerdict> = [];
			
			// Process each token once
			for (let i = 0; i < tokens.length; i++) {
				console.log(`Processing token ${i + 1}/${tokens.length}:`, tokens[i]);
				console.log(`Token type:`, typeof tokens[i]);
				console.log(`Token length:`, tokens[i]?.length);
				
				try {
					console.log(`Calling checkStatus for token:`, tokens[i]);
					const currentTestcaseVerdict = await checkStatus(tokens[i], true);
					console.log("currentTestcaseVerdict...", currentTestcaseVerdict);
					console.log("currentTestcaseVerdict type:", typeof currentTestcaseVerdict);
					
					if (currentTestcaseVerdict !== undefined) {
						console.log("Adding verdict to array:", currentTestcaseVerdict);
						testcasesVerdict.push(currentTestcaseVerdict);
					} else {
						console.warn(`No verdict received for token ${i + 1}`);
						// Add a default verdict if none received
						const defaultVerdict = {
							status: "Error",
							time: 0,
							memory: 0
						};
						console.log("Adding default verdict:", defaultVerdict);
						testcasesVerdict.push(defaultVerdict);
					}
				} catch (error) {
					console.error(`Error checking status for token ${i + 1}:`, error);
					// Add error verdict
					const errorVerdict = {
						status: "Error",
						time: 0,
						memory: 0
					};
					console.log("Adding error verdict:", errorVerdict);
					testcasesVerdict.push(errorVerdict);
				}
			}
			
			console.log("Final Testcases Verdict...", testcasesVerdict);
			
			const submissionResp = await codeExecutionService.storeSubmission(
				{
					submissionSourceCode: code,
					submissionLanguageId: language.id,
					submissionProblemId: problemId,
					submissionTestcasesVerdict: testcasesVerdict,
				},
				assignmentId,
				contestId,
				problemDifficulty,
			);
			console.log("submissionResp...", submissionResp);
			
			if (!submissionResp.data.ok) {
				setSubmitProcessing(false);
				// Check for specific contest-related errors
				if (submissionResp.message && submissionResp.message.includes("User not found in contest")) {
					showErrorToast("You are not registered for this contest. Please contact your administrator.");
				} else if (submissionResp.message && submissionResp.message.includes("Submission deadline has passed")) {
					showErrorToast("The submission deadline has passed for this contest.");
				} else {
					showErrorToast(submissionResp.message || "Failed to store submission.");
				}
				return;
			}
			
			const submissionDetails = submissionResp.data.data as Submission;
			setSubmissionDetails(submissionDetails);
			setIsModalVisible(true);
			console.log("Modal visibility should be true now: ", isModalVisible);
			setSubmitProcessing(false);
		} catch (error) {
			console.error("Error in handleSubmit:", error);
			setSubmitProcessing(false);
			showErrorToast("An error occurred while submitting. Please try again.");
		}
	};

	const closeModal = () => {
		setIsModalVisible(false);
	};

	const handleThemeChange = (th: themeOption | null) => {
		if (!th) return;
		defineTheme(th.value).then(() => setTheme(th));
	};

	const handleEditorChange = (value: string | undefined) => {
		if (value === undefined) return;
		setCode(value);
		onChange("code", value);
	};

	useEffect(() => {
		defineTheme("dark").then(() => setTheme(themeOptions[1]));
		handleLanguageChange(languageOptions[0]);
		handleThemeChange(themeOptions[1]);
		setCode(problemCppTemplate);
	}, []);

	const showSuccessToast = (msg: string) => {
		toast.success(msg || `Compiled Successfully!`, {
			position: "top-right",
			autoClose: 1000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
		});
	};

	const showErrorToast = (msg: string) => {
		toast.error(msg || `Something went wrong! Please try again.`, {
			position: "top-right",
			autoClose: 1000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
		});
	};

	return (
		<>
			<ToastContainer
				position="top-right"
				autoClose={2000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
			/>
			{isModalVisible && (
				<SubmissionDetails
					submissionDetails={submissionDetails}
					closeModal={closeModal}
				/>
			)}
			<div>
				<div className="tabs tabs-boxed mb-4 bg-gray-100 font-bold text-lg">
					<a
						className={`tab ${
							tab === "Editor" ? "bg-white text-secondary text-xl" : "text-xl"
						}`}
						onClick={() => setTab("Editor")}>
						Editor
					</a>
					<a
						className={`tab ${
							tab === "Input" ? "bg-white text-secondary text-xl" : "text-xl"
						}`}
						onClick={() => setTab("Input")}>
						Input
					</a>
					<a
						className={`tab ${
							tab === "Output" ? "bg-white text-secondary text-xl" : "text-xl"
						}`}
						onClick={() => setTab("Output")}>
						Output
					</a>
				</div>
				{/* Code Editor Component */}
				{tab === "Editor" && (
					<div
						className={`flex flex-col border-4 border-secondary rounded-xl ${
							theme.label === "Light" ? "bg-gray-50" : "bg-editorbg"
						}`}>
						<div className="flex flex-row justify-center items-center w-full space-x-8 p-4">
							<div className="w-1/2 flex flex-row items-center justify-center space-y-2">
								<label className="text-xl font-semibold text-secondary mr-2">
									Language:{" "}
								</label>
								<LanguagesDropdown
									onSelectChange={handleLanguageChange}
									languageDefaultOption={language}
								/>
							</div>
							<div className="w-1/2 flex flex-row items-center justify-center space-y-2">
								<label className="text-xl font-semibold text-secondary mr-2">
									Theme:
								</label>
								<ThemeDropdown handleThemeChange={handleThemeChange} />
							</div>
						</div>
						<div
							className={`w-full bg-basecolor ${
								theme.label === "Light" ? "bg-gray-50" : "bg-editorbg"
							} p-2 rounded-xl`}>
							<div className="flex flex-col w-full h-full justify-start items-end p-2 mb-2">
								<CodeEditorWindow
									code={code}
									onChange={onChange}
									language={language?.value}
									theme={theme.value}
									readOnly={false} // Pass readOnly prop
								/>
							</div>
							<div className="flex flex-row justify-end items-center m-2 px-4">
								<button
									onClick={handleCompile}
									disabled={!code}
									className="btn btn-sm btn-primary text-white text-lg">
									{runProcessing ? "Processing..." : "Compile"}
								</button>
								<div className="divider divider-horizontal"></div>
								<button
									disabled={!code}
									onClick={handleSubmit}
									className="btn btn-sm btn-success text-white text-lg">
									{submitProcessing ? "Submitting..." : "Submit"}
								</button>
							</div>
						</div>
					</div>
				)}
				{/* Output Window Component */}
				{tab === "Output" && (
					<div className="flex flex-col">
						<div className="flex flex-shrink-0 w-full flex-col">
							<div className="flex flex-col items-end"></div>
							{outputDetails && <OutputDetails outputDetails={outputDetails} />}
						</div>
						<div className="w-full bg-white border-basecolor rounded-box p-6">
							<OutputWindow
								outputDetails={outputDetails}
								language_id={language.id}
							/>
						</div>
					</div>
				)}
				{/* Custom Input Component */}
				{tab === "Input" && (
					<div className="flex flex-col">
						<div className="bg-white border-basecolor rounded-box p-2">
							<CustomInput
								customInput={customInput}
								setCustomInput={setCustomInput}
							/>
							<div className="divider divider-horizontal"></div>
							<div className="flex flex-row justify-end items-center m-2 px-4">
								<button
									onClick={handleCompile}
									disabled={!code}
									className="btn btn-sm btn-primary text-white text-lg">
									{runProcessing ? "Processing..." : "Compile"}
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</>
	);
};

export default CodeEditor;
