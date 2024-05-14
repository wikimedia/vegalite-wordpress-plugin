<?php
/**
 * Plugin Name: Wikimedia Diff Asset Loader
 * Plugin URI: https://github.com/wpcomvip/wikimedia-blog-wikimedia-org
 * Description: Reusable asset loader framework to permit hot-reloading with wp-scripts.
 * Author: Human Made
 * Author URI: https://humanmade.com/
 * Version: 1.0.0
 * License: GPL2+
 * License URI: https://www.gnu.org/licenses/gpl-2.0.txt
 *
 * @package wikimediadiff
 */

namespace WikimediaDiff\Asset_Loader;

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

// Require utility functions.
require_once __DIR__ . '/inc/namespace.php';
require_once __DIR__ . '/inc/utilities.php';
