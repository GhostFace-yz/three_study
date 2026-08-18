// 数值重映射工具：把 value 从 [originMin, originMax] 区间线性映射到 [destinationMin, destinationMax] 区间
// 烟火爆炸用：uProgress 是 0→1 的动画进度，但粒子尺寸的生命周期不是全程一致——
// 爆炸初期粒子从小炸开变大，末期逐渐缩小消失，用 remap 把 0→1 的进度切段映射到不同的尺寸区间
float remap(float value, float originMin, float originMax, float destinationMin, float destinationMax)
{
    // 先算 value 在原始区间里的位置比例，再套到目标区间
    return destinationMin + (value - originMin) * (destinationMax - destinationMin) / (originMax - originMin);
}

// 带夹取的版本：value 超出原始区间时，结果会被 clamp 到目标区间内
// 烟花动画结束时 uProgress 可能因缓动函数超过 1.0，不夹取的话尺寸会算成负数
float remapClamped(float value, float originMin, float originMax, float destinationMin, float destinationMax)
{
    float normalized = clamp((value - originMin) / (originMax - originMin), 0.0, 1.0);
    return mix(destinationMin, destinationMax, normalized);
}
