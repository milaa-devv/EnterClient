// src/pages/areas/NuevaEmpresa.tsx
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, Send } from 'lucide-react'
import { FormStepper } from '@/components/FormStepper'
import { FormProvider} from '@/contexts/FormContext'
import { useMultiStepForm } from '@/hooks/useMultiStepForm'

// Componentes de cada paso
import { DatosGeneralesStep } from '@/components/forms/DatosGeneralesStep'
import { DatosContactoStep } from '@/components/forms/DatosContactoStep'
import { ActividadesEconomicasStep } from '@/components/forms/ActividadesEconomicasStep'
import { RepresentantesLegalesStep } from '@/components/forms/RepresentantesLegalesStep'
import { DocumentosTributariosStep } from '@/components/forms/DocumentosTributariosStep'
import { ContrapartesStep } from '@/components/forms/ContrapartesStep'
import { UsuariosPlataformaStep } from '@/components/forms/UsuariosPlataformaStep'
import { ConfiguracionNotificacionesStep } from '@/components/forms/ConfiguracionNotificacionesStep'
import { InformacionPlanStep } from '@/components/forms/InformacionPlanStep'

const STEP_COMPONENTS = [
  DatosGeneralesStep,
  DatosContactoStep,
  ActividadesEconomicasStep,
  RepresentantesLegalesStep,
  DocumentosTributariosStep,
  ContrapartesStep,
  UsuariosPlataformaStep,
  ConfiguracionNotificacionesStep,
  InformacionPlanStep
]

const NuevaEmpresaContent: React.FC = () => {
  const navigate = useNavigate()
  //const { state } = useFormContext()
  const {
    currentStep,
    totalSteps,
    nextStep,
    prevStep,
    isLoading,
    saveProgress,
    submitForm
  } = useMultiStepForm()

  const CurrentStepComponent = STEP_COMPONENTS[currentStep]
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === totalSteps - 1

  const handlePrevious = () => {
    if (isFirstStep) {
      navigate('/comercial')
    } else {
      prevStep()
    }
  }

  const handleNext = async () => {
    const success = await nextStep()
    if (success && isLastStep) {
      try {
        await submitForm()
        navigate('/comercial', { 
          state: { 
            message: 'Empresa creada exitosamente y enviada a Onboarding' 
          }
        })
      } catch (error) {
        console.error('Error enviando formulario:', error)
      }
    }
  }

  const handleSaveDraft = async () => {
    try {
      await saveProgress()
      // Mostrar mensaje de éxito
    } catch (error) {
      console.error('Error guardando borrador:', error)
    }
  }

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="row mb-4">
        <div className="col">
          <div className="d-flex align-items-center gap-3 mb-3">
            <button
              className="btn btn-outline-secondary"
              onClick={() => navigate('/comercial')}
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="font-primary fw-bold mb-0">Nueva Empresa</h1>
              <p className="text-muted small mb-0">
                Complete la información para registrar una nueva empresa cliente
              </p>
            </div>
          </div>

          {/* Stepper */}
          <FormStepper orientation="horizontal" />
        </div>
      </div>

      {/* Form Content */}
      <div className="row">
        <div className="col-lg-10 col-xl-8 mx-auto">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <CurrentStepComponent />
            </div>

            {/* Footer con botones */}
            <div className="card-footer bg-light">
              <div className="d-flex justify-content-between align-items-center">
                <div className="text-muted small">
                  Paso {currentStep + 1} de {totalSteps}
                </div>

                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary d-flex align-items-center gap-2"
                    onClick={handleSaveDraft}
                    disabled={isLoading}
                  >
                    <Save size={16} />
                    Guardar Borrador
                  </button>

                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handlePrevious}
                    disabled={isLoading}
                  >
                    {isFirstStep ? 'Cancelar' : 'Anterior'}
                  </button>

                  <button
                    type="button"
                    className={`btn ${isLastStep ? 'btn-success' : 'btn-primary'} d-flex align-items-center gap-2`}
                    onClick={handleNext}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="spinner-border spinner-border-sm" role="status" />
                        {isLastStep ? 'Enviando...' : 'Guardando...'}
                      </>
                    ) : (
                      <>
                        {isLastStep ? (
                          <>
                            <Send size={16} />
                            Enviar a Onboarding
                          </>
                        ) : (
                          'Siguiente'
                        )}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const NuevaEmpresa: React.FC = () => {
  return (
    <FormProvider>
      <NuevaEmpresaContent />
    </FormProvider>
  )
}

export default NuevaEmpresa
