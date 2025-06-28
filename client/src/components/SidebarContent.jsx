import { ChartNoAxesColumn, SquareLibrary } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const SidebarContent = ({ onClick }) => {
  const user = useSelector((state) => state.auth.user);
  const isOwner = user?.role === "owner";

  return (
    <div className="space-y-4 border-r-2">
      {isOwner && (
        <Link
          to="/admin/owner-dashboard"
          className="flex items-center gap-2"
          onClick={onClick}
        >
          <ChartNoAxesColumn size={22} />
          <h1>Owner Dashboard</h1>
        </Link>
      )}
      <Link to="/admin/dashboard" className="flex items-center gap-2" onClick={onClick}>
        <ChartNoAxesColumn size={22} />
        <h1>Instructor Dashboard</h1>
      </Link>
      <Link to="/admin/course" className="flex items-center gap-2" onClick={onClick}>
        <SquareLibrary size={22} />
        <h1>Courses</h1>
      </Link>
    </div>
  );
};

export default SidebarContent;
