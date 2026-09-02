package com.beebank.player;

record PlayerResponse(Long id, String name, String team) {

    static PlayerResponse from(Player player) {
        return new PlayerResponse(player.getId(), player.getName(), player.getTeam());
    }
}
