/*
 Navicat Premium Data Transfer

 Source Server         : local-db
 Source Server Type    : MySQL
 Source Server Version : 80015
 Source Host           : 127.0.0.1:5678
 Source Schema         : cc

 Target Server Type    : MySQL
 Target Server Version : 80015
 File Encoding         : 65001

 Date: 05/04/2019 23:26:47
*/
SET
  NAMES utf8mb4;
SET
  FOREIGN_KEY_CHECKS = 0;
-- ----------------------------
  -- Table structure for config
  -- ----------------------------
  DROP TABLE IF EXISTS `config`;
CREATE TABLE `config` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `app` varchar(32) COLLATE utf8mb4_general_ci NOT NULL COMMENT 'app name',
    `env` varchar(32) COLLATE utf8mb4_general_ci NOT NULL COMMENT 'env name',
    `config` text COLLATE utf8mb4_general_ci NOT NULL COMMENT 'config, as json',
    `created_at` datetime NOT NULL COMMENT 'created at',
    `enable` tinyint(2) NOT NULL DEFAULT '1' COMMENT '1 enable 2 disable',
    `updated_at` datetime COMMENT 'updated at',
    PRIMARY KEY (`id`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;
SET
  FOREIGN_KEY_CHECKS = 1;