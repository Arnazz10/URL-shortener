
import { X, Download, Copy, Share2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function QRCodeModal({ qrCodeBase64, shortUrl, isOpen, onClose }) {
    if (!isOpen) return null;

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = `data:image/png;base64,${qrCodeBase64}`;
        link.download = `qrcode-${shortUrl.split('/').pop()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('QR Code downloaded!');
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(shortUrl);
        toast.success('Short URL copied!');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all scale-100 animate-scale-up">
                <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center">
                        <Share2 className="mr-2 h-5 w-5 text-purple-600" /> Share Link
                    </h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                <div className="p-8 flex flex-col items-center">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative bg-white p-2 rounded-xl border border-gray-100">
                            <img
                                src={`data:image/png;base64,${qrCodeBase64}`}
                                alt="QR Code"
                                className="w-48 h-48 object-contain rounded-lg"
                            />
                        </div>
                    </div>

                    <div className="mt-6 w-full bg-gray-50 p-3 rounded-xl flex items-center justify-between border border-gray-200">
                        <span className="text-sm font-medium text-gray-600 truncate mr-2">{shortUrl}</span>
                        <button onClick={handleCopy} className="text-blue-600 hover:text-blue-700 p-1.5 hover:bg-blue-50 rounded-lg transition-colors">
                            <Copy className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                <div className="p-4 bg-gray-50 border-t flex justify-center">
                    <button
                        onClick={handleDownload}
                        className="w-full btn-primary flex items-center justify-center shadow-md py-3"
                    >
                        <Download className="mr-2 h-4 w-4" /> Download QR Code
                    </button>
                </div>
            </div>
        </div>
    );
}
