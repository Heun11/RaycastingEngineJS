function rcWallCreate(x1, y1, x2, y2)
{
    return {
        x1:x1,
        y1:y1,
        x2:x2,
        y2:y2
    };
}

function rcWallRender(wall)
{
    engineDrawLine(wall.x1, wall.y1, wall.x2, wall.y2, stroke="#49d4cd");
}

function rcRayCreate(x, y)
{
    return {
        x:x,
        y:y,
        dx:1,
        dy:0,
        px:1,
        py:0
    };
}

// A = atan2(V.y, V.x)

function rcRaySetDir(ray, a)
{
    let x = Math.cos(engineToRad(a));
    let y = Math.sin(engineToRad(a));
    ray.dx = x;
    ray.dy = y;
}

function rcRayRender(ray)
{
    engineDrawLine(ray.x, ray.y, ray.px, ray.py, stroke="red", 1);
}

function rcRaySetPt(ray, pt)
{
    ray.px = pt.x;
    ray.py = pt.y;
}

function rcRayCast(ray, wall)
{
    const x1 = wall.x1;
    const y1 = wall.y1;
    const x2 = wall.x2;
    const y2 = wall.y2;

    const x3 = ray.x;
    const y3 = ray.y;
    const x4 = ray.x+ray.dx;
    const y4 = ray.y+ray.dy;

    const d = (x1-x2)*(y3-y4)-(y1-y2)*(x3-x4);
    if(d==0){
        return;
    }
    const t = ((x1-x3)*(y3-y4)-(y1-y3)*(x3-x4)) / d;
    const u = ((x1-x3)*(y1-y2)-(y1-y3)*(x1-x2)) / d;

    // if 0 ≤ t ≤ 1 and 0 ≤ u ≤ 1. 

    if(t>=0 && t<=1 && u>=0){
        let pt = {
            x: x1+t*(x2-x1),
            y: y1+t*(y2-y1)
        };
        ray.px = pt.x;
        ray.py = pt.y;
        return pt;
    }
    return;
}