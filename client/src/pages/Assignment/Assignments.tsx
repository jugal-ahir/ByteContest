// src/pages/Assignments.tsx

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { assignmentService } from "../../api/assignmentService";
import Navbar from "../../components/Utils/Navbar";
import AssignmentCard from "../../components/Assignment/AssignmentCard";
import { Assignment } from "../../types/assignment";
import { useNavigate } from "react-router-dom";
import { isOngoing, isUpcoming, isCompleted } from "../../lib/dateUtils";
import ErrorModal from "../../components/Utils/ErrorModal";
const Assignments = () => {
	const [status, setStatus] = useState(false);
	const currentStatus = useSelector((state: any) => state.auth.status);
	const user = useSelector((state: any) => state.auth.userData);
	const isAdmin = user?.userIsAdmin;
	const [assignments, setAssignments] = useState<Assignment[]>([]);
	const navigate = useNavigate();
	const [errorModal, setErrorModal] = useState<boolean>(false);
	const [message, setMessage] = useState<string>("");
	const [serverTime, setServerTime] = useState<string>("");
	useEffect(() => {
		setStatus(currentStatus);
		if (currentStatus) {
			assignmentService
				.getAllAssignments()
				.then((data) => {
					setServerTime(data.serverTime);
					if (data.data.ok) {
						if (user?.userIsAdmin === false) {
							const userAssignments = data.data.assignments.filter(
								(assignment: Assignment) =>
									assignment.assignmentSection === user?.userSection,
							);
							setAssignments(userAssignments);
						} else {
							setAssignments(data.data.assignments);
						}
					} else {
						setMessage(data.data.message);
						setErrorModal(true);
					}
				})
				.catch((err) => {
					setMessage("Error fetching assignments" || err?.message);
					setErrorModal(true);
				});
		}
	}, [currentStatus]);

	const handleAssignmentClick = (assignmentId: number) => {
		navigate(`/assignment/${assignmentId}`);
	};

	const handleAddAssignmentClick = () => {
		navigate(`/assignment/create`);
	};

	return (
		<div className="flex flex-col min-h-screen">
			<Navbar currentPage="Assignment" />
			<div className="bg-white w-full min-h-screen border-4 border-secondary shadow-xl flex flex-col p-8">
				<div>
					{isAdmin && (
						<div className="flex flex-row justify-begin items-center m-4">
							<button
								onClick={handleAddAssignmentClick}
								className="btn btn-primary btn-md text-lg mb-4 text-white">
								Add Assignment
							</button>
						</div>
					)}
					{status ? (
						<div className="flex flex-col">
							{["Ongoing", "Upcoming", "Completed"].map((assignmentStatus) => (
								<div
									key={assignmentStatus}
									className="collapse collapse-arrow bg-gray-100 mb-4">
									<input
										type="checkbox"
										defaultChecked={assignmentStatus === "Ongoing"}
									/>
									<div className="collapse-title text-2xl font-bold text-secondary">
										{assignmentStatus} Assignments
									</div>
									<div className="collapse-content">
										<div className="flex flex-col">
											{assignments.map((assignment) => {
												const isCurrentAssignment =
													assignmentStatus === "Ongoing" &&
													isOngoing(assignment, serverTime);
												const isFutureAssignment =
													assignmentStatus === "Upcoming" &&
													isUpcoming(assignment, serverTime);
												const isPastAssignment =
													assignmentStatus === "Completed" &&
													isCompleted(assignment, serverTime);

												if (
													isCurrentAssignment ||
													isFutureAssignment ||
													isPastAssignment
												) {
													return (
														<AssignmentCard
															key={assignment.assignmentId}
															assignment={assignment}
															user={user}
															serverTime={serverTime}
															handleClick={handleAssignmentClick}
															isAdmin={isAdmin} // Pass admin status
														/>
													);
												}
												return null;
											})}
										</div>
									</div>
								</div>
							))}
						</div>
					) : (
						<h2 className="text-2xl text-basecolor">
							Please login to view this page
						</h2>
					)}
					{errorModal && (
						<ErrorModal
							message={message}
							isOpen={errorModal}
							onClose={() => setErrorModal(false)}
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default Assignments;
