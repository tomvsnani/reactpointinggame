import './PointingGame.css'
import { useEffect, useState } from 'react'

const PointsNumberArray = [1,2,3,4,5,6,7,8,9,10,"?"]

export default function PointingGame({playersList, onPlayerPointed}){

    const [selectedPoint, setselectedPoint] = useState(-1)

    const [pointsCounter, setPointsCounter] = useState([])

    useEffect(() => {
      
        let pointsArray = []

        playersList.forEach(element => {

            let pointPair = pointsArray.find(obj=>obj.name == element.point)
            
            if(pointPair)
                pointPair.point = pointPair.point + 1
            else if(element.point)
                pointsArray.push({name:element.point,point:1})
        });

        setPointsCounter(pointsArray)
    
    }, [playersList])
    

    const onPointChange = (e)=>{
        setselectedPoint(e.target.textContent)
        onPlayerPointed(e.target.textContent)
    }

    return(
    <div className='PointingGameContainer'>
            <div>
                <h2>Pick A Point</h2>
                <div className="PointListContainer">
                    <PointsComponent selectedPoint={selectedPoint} onPointChange={onPointChange}></PointsComponent>
                </div>
                <h2>Players</h2>
                <div className='PlayerListContainer'><PlayersList playerDetails={playersList}></PlayersList></div>
            </div>
            <div>
                <h2>Summary</h2>
                <div className='PlayerListContainer'><PlayersList playerDetails={pointsCounter}></PlayersList></div>
                { (pointsCounter.length == 1 && pointsCounter[0].point === playersList.length) &&
                    <h1 style={{
                                fontSize:'Bold',
                                color:'green'
                            }}> Consensus
                
                  </h1>
                }
            </div>
    </div>
    )
}

function PointsComponent({selectedPoint, onPointChange}){
   return(<>
   {
    PointsNumberArray.map(number => <Points key={number} value={number} selectedPoint={selectedPoint} onPointChange={onPointChange}></Points>)
   }  
   </>)
}

function Points({value, selectedPoint, onPointChange}){
    return <button className = {value==selectedPoint ? "Points selected":"Points"} onClick={(e)=>onPointChange(e)}>{value}</button>
}

function PlayersList({playerDetails}){
return(<>
{
    playerDetails.map((player)=> <PlayerComponent name={player.name} value={player.point} key={player.identifier}></PlayerComponent>)
}
</>)
}

function PlayerComponent({name, value}){
return <div className='PlayerItem'>
    <h4>{name}</h4>
    <h4>{value}</h4>
</div>
}
