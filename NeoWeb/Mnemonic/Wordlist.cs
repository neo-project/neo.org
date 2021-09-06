using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace NeoWeb
{
    public abstract class Wordlist
    {
        public List<string> WordList { get; }

        public Wordlist(string[] words)
        {
            WordList = words.ToList();
        }
    }
}
