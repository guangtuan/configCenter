/*
 Navicat Premium Data Transfer

 Source Server         : local-db
 Source Server Type    : MySQL
 Source Server Version : 50643
 Source Host           : 127.0.0.1:5678
 Source Schema         : cc

 Target Server Type    : MySQL
 Target Server Version : 50643
 File Encoding         : 65001

 Date: 05/04/2019 23:59:36
*/
SET
  NAMES utf8mb4;
SET
  FOREIGN_KEY_CHECKS = 0;
-- ----------------------------
  -- Table structure for app
  -- ----------------------------
  DROP TABLE IF EXISTS `app`;
CREATE TABLE `app` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `app` varchar(32) NOT NULL COMMENT 'app name',
    `created_at` datetime NOT NULL COMMENT 'created at',
    `enable` tinyint(2) NOT NULL DEFAULT '1' COMMENT '1 enable 2 disable',
    `updated_at` datetime COMMENT 'updated at',
    PRIMARY KEY (`id`) USING BTREE,
    UNIQUE KEY `app` (`app`)
  ) ENGINE = InnoDB AUTO_INCREMENT = 4 DEFAULT CHARSET = utf8mb4;
SET
  FOREIGN_KEY_CHECKS = 1;