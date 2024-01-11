import { useQuery } from "react-query";
import { getConti } from "../api";
import { ContiType } from "../types";
import { useParams } from "react-router-dom";

function ContiDetail() {
  const { id: cid } = useParams();
  const { data, isLoading } = useQuery<ContiType>({
    queryKey: ["conties", "conti"],
    queryFn: () => getConti(Number(cid)),
  });

  console.log(isLoading, data);

  return (
    <div>
      <div>{data?.owner.name}</div>
      <div>{data?.created_at}</div>
      <div>
        {data?.songs.map((s, i) => (
          <div key={i}>{s.title}</div>
        ))}
      </div>
      <div>
        {data?.keywords.map((k, i) => (
          <div key={i}>{k}</div>
        ))}
      </div>
    </div>
  );
}

export default ContiDetail;
