using System.Collections.Generic;

namespace NeoWeb
{
    public abstract class Wordlist(string[] words)
    {
        public List<string> WordList { get; } = [.. words];
    }
}
