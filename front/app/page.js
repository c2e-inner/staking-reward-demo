'use client'
import { useStakingRewardsContext } from "@/context/contract";
import { Button } from "@mui/material";
export default function Home() {
  const { mintSTK, addSTK, addRTK, stakeSTK, withdrawRTK, queryBalance } = useStakingRewardsContext();
  return (
    <div className="my-4 flex">
      <div className="mr-4">
        <Button
          variant="contained"
          onClick={mintSTK}
        >
          领取 1 STK 到账号
        </Button>
      </div>
      <div className="mr-4">
        <Button
          variant="contained"
          onClick={stakeSTK}
        >
          质押 1 STK 到合约
        </Button>
      </div>
      <div className="mr-4">
        <Button
          variant="contained"
          onClick={withdrawRTK}
        >
          撤回 1 RTK 到账号
        </Button>
      </div>
      <div className="mr-4">
        <Button
          variant="contained"
          onClick={addSTK}
        >
          add STK
        </Button>
      </div>
      <div className="mr-4">
        <Button
          variant="contained"
          onClick={addRTK}
        >
          add RTK
        </Button>
      </div>

      <div className="mr-4">
        <Button
          variant="contained"
          onClick={queryBalance}
        >
          查询balance
        </Button>
      </div>
    </div>
  );
}
