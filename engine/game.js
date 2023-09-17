var world = [
    rcWallCreate(100,100,600,100),
    rcWallCreate(600,100,800,800),
    rcWallCreate(800,800,200,600),
    rcWallCreate(200,600,100,100),
    rcWallCreate(300,200,300,500),
    rcWallCreate(300,500,400,300),
    rcWallCreate(400,300,300,200)
]

var mouse_sensitivity_divider = 4;
var mouse_angle = 0;

function playerCreate()
{
    let player = {
        x:200,
        y:200,
        vx: 0,
        vy: 0,
        v: 3,
        s:20,
        a:1,
        fov: 60,
        pov: 60,
        rays: []
    }
    for(let i=0;i<player.fov;i++){
        player.rays.push(rcRayCreate(player.x, player.y));
    }
    return player;
}

function playerRender(player, world)
{
    player.x += player.vx;
    player.y += player.vy;

    if(engineMousePos){
        player.a = engineMap(engineMousePos.x, 0, canvas.width, 0, 360);
    }

    var shortest_dis, shortest_pt;

    for(let i=0;i<player.fov;i++){
        player.rays[i].x = player.x;
        player.rays[i].y = player.y;
        let rayA = (player.a - player.pov/2)+(player.pov/player.fov)*i;
        if(rayA<0){
            rayA+=360;
        }
        if(rayA>360){
            rayA-=360;
        }
        rcRaySetDir(player.rays[i], rayA);
        shortest_dis = Infinity;
        shortest_pt = {x:0, y:0};
        world.forEach((wall)=>{
            let pt = rcRayCast(player.rays[i], wall);
            if(pt){
                let new_distance = Math.abs(Math.sqrt((player.rays[i].x-player.rays[i].px)**2+(player.rays[i].y-player.rays[i].py)**2));
                if(new_distance<shortest_dis){
                    shortest_dis = new_distance;
                    shortest_pt.x = pt.x;
                    shortest_pt.y = pt.y;
                }
            }
        });
        rcRaySetPt(player.rays[i], shortest_pt);
        rcRayRender(player.rays[i]);
    }
    engineDrawRectangle(player.x-player.s/2, player.y-player.s/2, player.s,player.s,'#e42cbc');
}

function playerMove(t, e, player)
{
    if(t=='KeyDown'){
        if(e.code=='KeyS'){
            player.vy = -Math.sin(engineToRad(player.a))*player.v;
            player.vx = -Math.cos(engineToRad(player.a))*player.v;
        }
        if(e.code=='KeyW'){
            player.vy = Math.sin(engineToRad(player.a))*player.v;
            player.vx = Math.cos(engineToRad(player.a))*player.v;
        }
    }
    if(t=='KeyUp'){
        if(e.code=='KeyS'){
            player.vy = 0;
            player.vx = 0;
        }
        if(e.code=='KeyW'){
            player.vy = 0;
            player.vx = 0;
        }
    }
}

function viewRender(player)
{
    var view = {w:1000, h:canvas.height, x:canvas.width-1000, y:0};
    engineDrawRectangle(view.x, view.y, view.w,view.h,'#000000');
    var w = view.w/player.fov;
    for(let i=0;i<player.fov;i++){
        let distance = Math.sqrt((player.rays[i].x-player.rays[i].px)**2+(player.rays[i].y-player.rays[i].py)**2);
        let h = canvas.height;
        if(distance!=0){
            let angle = player.a-((player.a-player.fov/2)+(player.pov/player.fov)*i);
            if(angle<0){angle+=360}
            if(angle>360){angle-=360}
            let dis = distance*Math.cos(engineToRad(angle));
            h = canvas.height/dis*30;
        }
        if(h>0){
            engineDrawRectangle(view.x+w*i, (canvas.height/2)-(h/2), w+1,h, `rgb(${engineMap(h, 0, canvas.height, 0,200)},${engineMap(h, 0, canvas.height, 0,200)},${engineMap(h, 0, canvas.height, 0,200)}`);
        }
    }
}

var player = playerCreate(); 

function gUpdate()
{
    // minimap rendering
    world.forEach((wall)=>{
        rcWallRender(wall);
    });
    playerRender(player, world);
    
    //view rendering
    viewRender(player);
}

function gKeyDown(e)
{
    playerMove("KeyDown", e, player);
}

function gKeyUp(e)
{
    playerMove("KeyUp", e, player);
}