using System;
using System.Diagnostics;
using System.IO;
using System.Windows.Forms;

class Launcher
{
    [STAThread]
    static void Main()
    {
        try
        {
            string baseDir = AppDomain.CurrentDomain.BaseDirectory;
            string indexPath = Path.Combine(baseDir, "index.html");

            if (!File.Exists(indexPath))
            {
                MessageBox.Show("Could not find 'index.html' in: " + baseDir, "Questify Launcher Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                return;
            }

            string fileUrl = new Uri(indexPath).AbsoluteUri;

            // Locate Edge
            string edgePath = @"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe";
            if (!File.Exists(edgePath))
            {
                edgePath = @"C:\Program Files\Microsoft\Edge\Application\msedge.exe";
            }

            if (File.Exists(edgePath))
            {
                ProcessStartInfo psi = new ProcessStartInfo
                {
                    FileName = edgePath,
                    Arguments = "--app=\"" + fileUrl + "\" --no-sandbox",
                    UseShellExecute = true
                };
                Process.Start(psi);
            }
            else
            {
                // Fallback to opening file in default browser
                ProcessStartInfo psi = new ProcessStartInfo
                {
                    FileName = fileUrl,
                    UseShellExecute = true
                };
                Process.Start(psi);
            }
        }
        catch (Exception ex)
        {
            MessageBox.Show("Failed to launch Questify:\n" + ex.Message, "Questify Launcher Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
        }
    }
}
