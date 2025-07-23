import { useState } from "react";
import { ContestUser } from "../../types/contest";
import { contestService } from "../../api/contestService";
import ErrorModal from "../Utils/ErrorModal";
import SuccessModal from "../Utils/SuccessModal";
import { useParams } from "react-router-dom";
interface StudentTableProps {
	students: ContestUser[];
}
const StudentTable = ({ students }: StudentTableProps) => {
	const [message, setMessage] = useState<string>("");
	const [isErrorModalOpen, setIsErrorModalOpen] = useState<boolean>(false);
	const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);
	const contestId = useParams<{ contestId: string }>().contestId;
	const handleClick = async (student: ContestUser) => {
		if (!contestId) return;
		const response = await contestService.retainContestUser(
			contestId,
			student.contestUserRollNumber,
		);
		if (response.data.ok) {
			setMessage("Student retained successfully.");
			setIsSuccessModalOpen(true);
		} else {
			setMessage(response.message || "Failed to retain student.");
			setIsErrorModalOpen(true);
		}
	};
	return (
		<div className="max-w-full overflow-x-auto bg-white shadow-lg rounded-lg mt-8">
			{students.length > 0 ? (
				<>
					<table className="min-w-full bg-white divide-y divide-gray-200">
						<thead>
							<tr className="bg-secondary text-white">
								<th className="px-6 py-3 text-left text-md font-semibold uppercase tracking-wider">
									Roll Number
								</th>
								<th className="px-6 py-3 text-left text-md font-semibold uppercase tracking-wider">
									Name
								</th>
								<th className="px-6 py-3 text-left text-md font-semibold uppercase tracking-wider">
									Current Marks
								</th>
								<th className="px-6 py-3 text-left text-md font-semibold uppercase tracking-wider">
									Retain
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-200">
							{students.map((student) => (
								<tr
									key={student.contestUserRollNumber}
									className="hover:bg-gray-100">
									<td className="px-6 py-4 whitespace-nowrap text-md text-gray-800">
										{student.contestUserRollNumber}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-md text-gray-800">
										{student.contestUserName}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-md text-gray-800">
										{student.contestUserCurrentMarks}
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<button
											onClick={() => handleClick(student)}
											className="btn btn-primary text-white text-lg">
											Retain
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</>
			) : (
				<div className="p-6 text-center text-gray-500">
					No students available
				</div>
			)}
			{isErrorModalOpen && (
				<ErrorModal
					message={message}
					onClose={() => setIsErrorModalOpen(false)}
					isOpen={isErrorModalOpen}
				/>
			)}
			{isSuccessModalOpen && (
				<SuccessModal
					message={message}
					onClose={() => setIsSuccessModalOpen(false)}
					isOpen={isSuccessModalOpen}
				/>
			)}
		</div>
	);
};

export default StudentTable;
