import React, { useMemo } from "react";
import { Navigate, useParams } from "react-router-dom";

export default function LearningPage() {
    const { skillName: skillNameParam } = useParams();
    const encoded = useMemo(() => encodeURIComponent(decodeURIComponent(skillNameParam || "")), [skillNameParam]);

    return <Navigate to={`/learn/${encoded}/course`} replace />;
}
