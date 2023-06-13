package com.example.demo.controller;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.example.demo.common.R;
import com.example.demo.entity.Position;
import com.example.demo.entity.User;
import com.example.demo.service.PositionService;
import com.example.demo.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;

import java.util.List;

public class PositionController {
    @Autowired
    PositionService positionService;

    /**
     * 展示所有职位
     * @return
     */
    @GetMapping("/allPositions")
    public R showAllPositions(){
        List<Position> positionList=positionService.list();
        return R.success(positionList);
    }

    /**
     * 展示所有操作单位
     * @return
     */
    @GetMapping("/operatingPositions")
    public R showOperatingPositions(){
        List<Position> positionList=positionService.getOperatingPositions();
        return R.success(positionList);
    }

    /**
     * 返回可选择的协助操作单位
     * @param token
     * @return
     */
    @GetMapping("/assistantPositions")
    public R showAssistantPositions(@RequestHeader String token){
        // 获取token
        DecodedJWT decode = JwtUtil.verifyToken(token);
        // 从token中获取职位id
        int positionId=decode.getClaim("positionId").asInt();
        // 获取操作单位
        List<Position> positionList=positionService.getOperatingPositions();
        // 从list中删除当前用户的职位
        positionList.removeIf(position -> position.getId() == positionId);
        return R.success(positionList);
    }
}
