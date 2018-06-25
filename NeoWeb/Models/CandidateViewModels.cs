using Neo.IO.Json;
using System;

namespace NeoWeb.Models
{
    public class CandidateViewModels
    {
        public string PublicKey { get; set; }

        public int  Votes { get; set; }

        public Candidate Info { get; set; }

        public bool Active { get; set; }

        static public CandidateViewModels FromJson(JObject obj)
        {
            return new CandidateViewModels()
            {
                PublicKey = obj["publickey"].AsString(),
                Votes = Convert.ToInt32(obj["votes"].ToString().Trim('"')),
                Active = obj["active"].AsBoolean()
            };
        }
    }
}