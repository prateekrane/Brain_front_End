import { useState } from 'react';
import { Upload, Brain, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import axios from 'axios'; // Import axios

const TumorDetection = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [dragActive, setDragActive] = useState(false);

    const handleImageSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedImage(file);
            setPreviewUrl(URL.createObjectURL(file));
            setResult(null);
            setError(null);
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            setSelectedImage(file);
            setPreviewUrl(URL.createObjectURL(file));
            setResult(null);
            setError(null);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!selectedImage) {
            setError("Please select an image first");
            return;
        }

        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('image', selectedImage);

        try {
            const response = await axios.post(
                'https://63c2-49-43-0-169.ngrok-free.app',
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "ngrok-skip-browser-warning": "69420", // Bypass ngrok browser warning
                    }
                }
            );

            setResult(response.data); // Access the data from the response
        } catch (err) {
            setError('Error processing image. Please try again.');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#EDF4F2] to-white p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    {/* Header Section */}
                    <div className="bg-[#31473A] text-white p-8">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <Brain size={32} className="animate-pulse" />
                            <h1 className="text-3xl font-bold">Brain Tumor Detection</h1>
                        </div>
                        <p className="text-center text-[#EDF4F2]/80">
                            Upload a brain scan image for instant tumor detection analysis
                        </p>
                    </div>

                    <div className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Upload Section */}
                            <div
                                className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 
                  ${dragActive
                                        ? 'border-[#31473A] bg-[#31473A]/5'
                                        : 'border-gray-300 hover:border-[#31473A]/50'}`}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                            >
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageSelect}
                                    className="hidden"
                                    id="image-input"
                                />
                                <label
                                    htmlFor="image-input"
                                    className="cursor-pointer flex flex-col items-center gap-4"
                                >
                                    <div className={`rounded-full p-4 transition-all duration-200
                    ${dragActive
                                            ? 'bg-[#31473A] text-white scale-110'
                                            : 'bg-[#EDF4F2] text-[#31473A] hover:scale-105'}`}
                                    >
                                        <Upload size={24} />
                                    </div>
                                    <div className="text-center">
                                        <p className="font-semibold text-[#31473A]">
                                            Drop your image here, or <span className="underline">browse</span>
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Supports: JPEG, PNG, DICOM
                                        </p>
                                    </div>
                                </label>
                            </div>

                            {/* Preview Section */}
                            {previewUrl && (
                                <div className="bg-[#EDF4F2]/30 rounded-xl p-6 transition-all duration-300">
                                    <p className="text-[#31473A] font-semibold mb-3">Selected Image:</p>
                                    <div className="relative rounded-lg overflow-hidden bg-black/5 aspect-video">
                                        <img
                                            src={previewUrl}
                                            alt="Selected scan"
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading || !selectedImage}
                                className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-200
                  flex items-center justify-center gap-2
                  ${loading || !selectedImage
                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        : 'bg-[#31473A] text-white hover:bg-[#31473A]/90 hover:scale-[0.99]'}
                                    `}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        Processing Scan...
                                    </>
                                ) : (
                                    <>
                                        <Brain size={20} />
                                        Analyze Scan
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Error Message */}
                        {error && (
                            <div className="mt-6 animate-fadeIn">
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Error</AlertTitle>
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            </div>
                        )}

                        {/* Results Section */}
                        {result && (
                            <div className="mt-6 animate-fadeIn">
                                <div className="bg-[#EDF4F2] rounded-xl p-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <CheckCircle2 className="text-[#31473A]" size={24} />
                                        <h2 className="text-xl font-semibold text-[#31473A]">
                                            Analysis Results
                                        </h2>
                                    </div>
                                    <div className="bg-white rounded-lg p-4">
                                        <pre className="whitespace-pre-wrap text-sm">
                                            {JSON.stringify(result, null, 2)}
                                        </pre>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-gray-500 text-sm mt-6">
                    This tool is for educational purposes only. Please consult healthcare professionals for medical advice.
                </p>
            </div>
        </div>
    );
};

export default TumorDetection;
