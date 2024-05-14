<?php
/**
 * Semi-private helpers namespace to separate the plugin's public loader API
 * methods from its internal utility functions.
 */
declare( strict_types=1 );

namespace WikimediaDiff\Asset_Loader\Utilities;

const SCRIPT_DEBUG_WARNING = 'Hot reloading was requested but SCRIPT_DEBUG is false. Your bundle will not load. Please enable SCRIPT_DEBUG or disable hot reloading.';

/**
 * Check whether a given dependencies array includes any of the handles for HMR
 * runtimes that WordPress will inject by default.
 *
 * @param string[] $dependencies Array of dependency script handles.
 * @return bool Whether any dependency is a react-refresh runtime.
 */
function includes_hmr_dependency( array $dependencies ) : bool {
	return array_reduce(
		$dependencies,
		function( $depends_on_runtime, $dependency_script_handle ) {
			return $depends_on_runtime || $dependency_script_handle === 'wp-react-refresh-runtime';
		},
		false
	);
}

/**
 * Check for a runtime file on disk based on the path of the assets file which
 * requires hot-reloading.
 *
 * @param string $asset_file_path Path to a script's asset.php file.
 * @param string $script_uri      Public URI of the script file, used to infer
 *                                the public URI of the runtime.
 * @return string URI to a valid runtime.js file, or empty string if not found.
 */
function infer_runtime_file_uri( $asset_file_path, $script_uri ) : string {
	// Heuristic: the runtime is expected to be in the same folder, or a parent
	// folder one level up from the target script.
	$expected_runtime_file = dirname( $asset_file_path ) . '/runtime.js';
	if ( is_readable( $expected_runtime_file ) ) {
		// Runtime is a sibling to the target file.
		return str_replace(
			// The contents after the final / will be the script filename.
			// Replace that with runtime.js to load the sibling URI.
			preg_replace( '#.*/#', '', $script_uri ),
			'runtime.js',
			$script_uri
		);
	}

	$expected_runtime_file = dirname( $asset_file_path, 2 ) . '/runtime.js';
	if ( is_readable( $expected_runtime_file ) ) {
		// Runtime is in the parent folder of the target file.
		return str_replace(
			// Trim off one additional folder of hierarchy from the script URI
			// to get the URI of the runtime file in the parent folder.
			preg_replace( '#.*/([^/]+/[^/]+)$#', '$1', $script_uri ),
			'runtime.js',
			$script_uri
		);
		return $expected_runtime_file;
	}

	// No runtime found in the asset directory or asset's parent directory.
	return '';
}

/**
 * Try to identify the location of a runtime chunk file relative to a requested
 * asset, register that chunk as a script if it hasn't been registered already,
 * then return the script handle for use as a script dependency.
 *
 * @param string $asset_file_path Path to a script's asset.php file.
 * @param string $script_uri      Public URI of the script file, used to infer
 *                                the public URI of the runtime.
 * @return string Handle of registered script runtime, or empty string if not found.
 */
function detect_and_register_runtime_chunk( string $asset_file_path, string $script_uri ) : string {
	$runtime_uri = infer_runtime_file_uri( $asset_file_path, $script_uri );
	if ( empty( $runtime_uri ) ) {
		return '';
	}

	// We may have multiple runtimes active, so add a path hash into the handle.
	$runtime_handle = sprintf( 'runtime-%s', md5( $runtime_uri ) );
	if ( ! wp_script_is( $runtime_handle, 'registered' ) ) {
		wp_register_script(
			$runtime_handle,
			$runtime_uri,
			[],
			filemtime( $asset_file_path )
		);
	}

	return $runtime_handle;
}

/**
 * Show a visible warning if we try to use a hot-reloading dev server while
 * SCRIPT_DEBUG is false: otherwise, the script will silently fail to load.
 *
 * @param array $asset_file Contents of a asset's *.asset.php file.
 */
function warn_if_script_debug_not_enabled( array $asset_file = [] ) : void {
	static $has_shown;

	$is_script_debug_mode = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG;

	if ( $has_shown || $is_script_debug_mode ) {
		return;
	}

	// Runtime only loads in SCRIPT_DEBUG mode. Show a warning.
	if ( is_admin() ) {
		wp_enqueue_script( 'wp-data' );
		add_action( 'admin_footer', __NAMESPACE__ . '\\show_editor_debug_mode_warning', 100 );
	} else {
		add_action( 'wp_footer', __NAMESPACE__ . '\\show_local_frontend_debug_mode_warning', 100 );
	}
	$has_shown = true;
}

/**
 * Use the block editor notices package to show a warning in the editor if
 * hot reloading is required by a script when SCRIPT_DEBUG is disabled.
 */
function show_editor_debug_mode_warning() : void {
	?>
	<script>
	window.addEventListener( 'DOMContentLoaded', () => {
		wp.data.dispatch( 'core/notices' ).createNotice(
			'warning',
			<?php echo wp_json_encode( SCRIPT_DEBUG_WARNING ) ?>,
			{
				isDismissible: false,
			}
		);
	} );
	</script>
	<?php
}

/**
 * Show a visible frontend notice if hot reloading is required by a script when
 * SCRIPT_DEBUG is disabled.
 *
 * Logs to error_log instead of showing visible error if not running locally,
 * though in practice HMR should never be running on deployed environments.
 */
function show_local_frontend_debug_mode_warning() : void {
	if ( wp_get_environment_type() !== 'local' ) {
		return;
	}
	?>
	<div style="z-index:100000;border-top:5px solid red;background:white;padding:1rem;width:100%;position:fixed;bottom:0;">
		<?php echo esc_html( SCRIPT_DEBUG_WARNING ); ?>
	</div>
	<?php
}
