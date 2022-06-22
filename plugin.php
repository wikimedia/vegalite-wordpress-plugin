<?php
/**
 * Plugin Name: Datavis Block
 * Description: Provide a block to render graphics using Vega Lite.
 * Author: Human Made
 * Author URI: https://humanmade.com
 * Version: 0.0.1
 */

namespace Datavis_Block;

require_once __DIR__ . '/inc/assets.php';
require_once __DIR__ . '/inc/blocks.php';

Assets\bootstrap();
Blocks\bootstrap();
