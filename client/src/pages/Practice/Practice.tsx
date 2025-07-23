import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Navbar from "../../components/Utils/Navbar";
import { Problem } from "../../types/problems";
import { problemService } from "../../api/problemService";
import ProblemsTable from "../../components/Problem/ProblemsTable";
import { useNavigate } from "react-router-dom";
const Practice = () => {
	const [status, setStatus] = useState(false);
	const [problems, setProblems] = useState<Array<Problem>>([]);
	const currentStatus = useSelector((state: any) => state.auth.status);
	const isAdmin = useSelector((state: any) => state.auth.userData?.userIsAdmin);
	const navigate = useNavigate();

	useEffect(() => {
		setStatus(currentStatus);
	}, [currentStatus]);

	useEffect(() => {
		async function getProblems() {
			await problemService
				.getProblems()
				.then((data) => {
					const currProblems: Array<Problem> = data.data.problems;
					setProblems(currProblems);
				})
				.catch((error) => {
					console.error(error);
				});
		}
		getProblems();
	}, []);

	const handleAddProblem = () => {
		navigate("/practice/create");
	};

	return (
		<div className="flex flex-col min-h-screen">
			{/* Navbar */}
			<Navbar currentPage="Practice" />

			{/* Content Section */}
			<div className="bg-white w-full min-h-screen border-4 border-secondary shadow-xl flex flex-col p-8">
				<div>
					{status ? (
						<div className="flex flex-col justify-center overflow-x-auto">
							<div className="flex flex-row justify-begin items-center m-4">
								{isAdmin && (
									<button
										onClick={handleAddProblem}
										className="btn btn-primary btn-md text-lg text-white">
										Add Problem
									</button>
								)}
							</div>

							{/* Problems Table */}
							<ProblemsTable problems={problems} userIsAdmin={isAdmin} />
						</div>
					) : (
						<h2 className="text-2xl text-basecolor">
							Please login to view this page
						</h2>
					)}
				</div>
			</div>
		</div>
	);
};

export default Practice;
