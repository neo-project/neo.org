using System.Text;
using dotless.Core;
using dotless.Core.configuration;
using NUglify;
using NUglify.Css;
using NUglify.JavaScript;

if (args.Length != 3)
{
    Console.Error.WriteLine("Usage: NeoWeb.AssetBuilder <projectDir> <cssAssetList> <jsAssetList>");
    return 1;
}

var projectDir = Path.GetFullPath(args[0]);
if (!Directory.Exists(projectDir))
{
    Console.Error.WriteLine($"Project directory not found: {projectDir}");
    return 1;
}

var cssAssets = SplitAssetList(args[1]);
var jsAssets = SplitAssetList(args[2]);

try
{
    if (cssAssets.Count > 0)
    {
        BuildCssAssets(projectDir, cssAssets);
    }

    if (jsAssets.Count > 0)
    {
        BuildJsAssets(projectDir, jsAssets);
    }
}
catch (Exception ex)
{
    Console.Error.WriteLine(ex.Message);
    return 1;
}

return 0;

static IReadOnlyList<string> SplitAssetList(string input)
{
    if (string.IsNullOrWhiteSpace(input))
    {
        return Array.Empty<string>();
    }

    return input
        .Split(';', StringSplitOptions.TrimEntries | StringSplitOptions.RemoveEmptyEntries)
        .Distinct(StringComparer.OrdinalIgnoreCase)
        .ToArray();
}

static void BuildCssAssets(string projectDir, IReadOnlyList<string> cssAssets)
{
    var lessConfig = new DotlessConfiguration
    {
        CacheEnabled = false,
        Debug = false,
        ImportAllFilesAsLess = true,
        MinifyOutput = false,
        Web = false
    };

    var lessEngine = new EngineFactory(lessConfig).GetEngine();
    var cssSettings = new CssSettings
    {
        CommentMode = CssComment.None
    };

    foreach (var asset in cssAssets)
    {
        var lessPath = Path.Combine(projectDir, "wwwroot", "css", $"{asset}.less");
        var cssPath = Path.Combine(projectDir, "wwwroot", "css", $"{asset}.css");
        var minCssPath = Path.Combine(projectDir, "wwwroot", "css", $"{asset}.min.css");

        EnsureFileExists(lessPath);
        var lessContent = File.ReadAllText(lessPath, Encoding.UTF8);
        lessEngine.ResetImports();
        lessEngine.CurrentDirectory = Path.GetDirectoryName(lessPath) ?? projectDir;
        var cssContent = lessEngine.TransformToCss(lessContent, lessPath);

        if (!lessEngine.LastTransformationSuccessful || string.IsNullOrWhiteSpace(cssContent))
        {
            throw new InvalidOperationException($"Failed to compile LESS file: {lessPath}");
        }

        var minifiedCss = Uglify.Css(cssContent, cssSettings);
        EnsureNoMinifyErrors(minifiedCss, lessPath);

        WriteFileIfChanged(cssPath, cssContent.Trim());
        WriteFileIfChanged(minCssPath, minifiedCss.Code);
        Console.WriteLine($"CSS built: {asset}");
    }
}

static void BuildJsAssets(string projectDir, IReadOnlyList<string> jsAssets)
{
    var jsSettings = new CodeSettings
    {
        PreserveImportantComments = false
    };

    foreach (var asset in jsAssets)
    {
        var jsPath = Path.Combine(projectDir, "wwwroot", "js", $"{asset}.js");
        var minJsPath = Path.Combine(projectDir, "wwwroot", "js", $"{asset}.min.js");

        EnsureFileExists(jsPath);
        var jsContent = File.ReadAllText(jsPath, Encoding.UTF8);
        var minifiedJs = Uglify.Js(jsContent, jsSettings);
        EnsureNoMinifyErrors(minifiedJs, jsPath);

        WriteFileIfChanged(minJsPath, minifiedJs.Code);
        Console.WriteLine($"JS built: {asset}");
    }
}

static void EnsureFileExists(string path)
{
    if (!File.Exists(path))
    {
        throw new FileNotFoundException($"Asset source file not found: {path}", path);
    }
}

static void EnsureNoMinifyErrors(UglifyResult result, string sourcePath)
{
    if (!result.HasErrors)
    {
        return;
    }

    var errors = string.Join(Environment.NewLine, result.Errors.Select(e => e.ToString()));
    throw new InvalidOperationException($"Minification failed for '{sourcePath}':{Environment.NewLine}{errors}");
}

static void WriteFileIfChanged(string path, string content)
{
    var normalized = content.Replace("\r\n", "\n");

    if (File.Exists(path))
    {
        var currentContent = File.ReadAllText(path, Encoding.UTF8).Replace("\r\n", "\n");
        if (string.Equals(currentContent, normalized, StringComparison.Ordinal))
        {
            return;
        }
    }

    File.WriteAllText(path, normalized, new UTF8Encoding(encoderShouldEmitUTF8Identifier: false));
}
